import { Line, StateEffect, StateField, Range, Transaction, EditorState } from "@codemirror/state";
import { Decoration, EditorView, ViewPlugin, ViewUpdate, WidgetType, type DecorationSet } from "@codemirror/view";
import { prepare, clearCache } from '@chenglou/pretext';
import { syntaxTree } from "@codemirror/language";
import { materializeRichInlineLineRange, prepareRichInline, walkRichInlineLineRanges, type RichInlineFragment, type RichInlineItem } from "@chenglou/pretext/rich-inline";

// Widget for the line breaks
class BreakWidget extends WidgetType {
  toDOM() {
    const br = document.createElement("br")
    br.className = "cm-break-widget"
    return br
  }
  override get lineBreaks() { return 1 }
}
const widget = new BreakWidget();

class Spacer extends WidgetType {
  constructor(public width: number) { super() }
  toDOM() {
    const span = document.createElement("span")
    span.className = "cm-spacer-widget"
    span.style.color = 'transparent'
    span.style.backgroundColor = 'hsl(from red h s l / .1)'
    span.style.marginInlineStart = `${this.width}px`
    
    return span
  }
  override get lineBreaks() { return 0 }
  override eq(other: Spacer) {
    return other.width === this.width
  }
}


// Define a clean, serializable payload for the effect instead of the entire ViewUpdate
type LayoutUpdate = {
  width: number;
  lines: Lines;
  viewport: { from: number; to: number };
  docChanged: boolean;
};

type Lines = {
  line: Line,
  offset: {
    amount: number,
    font: string,
  },
  rich: RichInlineItem[],
}[]

type Nodes = Map<string, { from: number, to: number }[]>;

const SKIP_BREAKS = [
  "FencedCode", "CodeBlock",
  
]
const breaks_regex = /\s*\S+/g;
const inlineMarks: {
  [key: string]: {
    breakOn: RegExp | null;
    extraWidth: number;
    weight?: number | string;
    style?: string;
    fontFamily?: string;
  };
} = {
  StrongEmphasis: {
    breakOn: breaks_regex,
    extraWidth: 0,
    weight: 700,
  },
  Strikethrough: {
    breakOn: breaks_regex,
    extraWidth: 0,
    weight: 400,
  },
  InlineCode: {
    breakOn: breaks_regex,
    extraWidth: 0,
    weight: 400,
    fontFamily: "'JetBrains Mono', monospace",
  },
  Emphasis: {
    breakOn: breaks_regex,
    extraWidth: 0,
    weight: 400,
    style: "italic",
  },
  URL: {
    breakOn: /[a-zA-Z]+:\/\/|\/[^\/?#]*|[?&][^?&#]*|[^\/?#]+/g,
    extraWidth: 0,
    weight: 400,
  },
};
const inlineOffsets = {
  QuoteMark: {
    offset: 1
  },
  ListMark: {
    offset: 1,
  },
  TaskMarker: {
    offset: 1
  },
}
const viewUpdateEffect = StateEffect.define<LayoutUpdate>();

export function mesureOffset(offset: string, font: string): number {
  if (!offset) return 0;
  // Medir el ancho real de un espacio en la fuente mediante prepare("a a", font)
  const spacePrep = prepare("a a", font);
  const spaceWidth = (spacePrep as any as { widths: number[] }).widths?.[1] ?? 4;
  
  const nonSpaces = offset.replaceAll(' ', '');
  let nonSpacesWidth = 0;
  if (nonSpaces.length > 0) {
    const prep = prepare(nonSpaces, font);
    nonSpacesWidth = (prep as any as { widths: number[] }).widths.reduce((cur, add) => cur + add, 0);
  }
  
  const spaceCount = offset.length - nonSpaces.length;
  return nonSpacesWidth + (spaceCount * spaceWidth);
}

function reconstrucLine(
  line_fragments: RichInlineFragment[],
  full_pieces: RichInlineItem[],
  cursor: { lastIndex: number; lastEnd: number },
  isFirstLine: boolean
): [string, { lastIndex: number; lastEnd: number }, number] {
  let line = "";
  let { lastIndex, lastEnd } = cursor;
  let skippedBreakSpaces = 0;

  for (let i = 0; i < line_fragments.length; i++) {
    const { itemIndex, sourceStart, sourceEnd } = line_fragments[i]!;

    if (itemIndex < lastIndex) {
      throw Error(
        `[breaks::reconstrucLine::badIndex] The item index should not be less than the cursor index '${itemIndex}'<'${lastIndex}'`
      );
    }

    // Recolectar todo el texto en full_pieces desde (lastIndex, lastEnd) hasta (itemIndex, sourceStart)
    let gap = "";
    while (lastIndex < itemIndex) {
      gap += full_pieces[lastIndex]!.text.slice(lastEnd);
      lastIndex++;
      lastEnd = 0;
    }
    gap += full_pieces[itemIndex]!.text.slice(lastEnd, sourceStart);

    // Si estamos en el primer fragmento de una línea que NO es la primera (es decir, tras un line break),
    // el espacio de separación entre la línea anterior y esta palabra es el espacio que causó el break.
    if (i === 0 && !isFirstLine) {
      skippedBreakSpaces = gap.length;
    } else {
      line += gap;
    }

    // Tomar el texto directo de full_pieces[itemIndex] garantiza fidelidad 1:1
    line += full_pieces[itemIndex]!.text.slice(sourceStart, sourceEnd);

    lastIndex = itemIndex;
    lastEnd = sourceEnd;

    if (lastEnd >= full_pieces[itemIndex]!.text.length) {
      lastIndex = itemIndex + 1;
      lastEnd = 0;
    }
  }

  return [line, { lastIndex, lastEnd }, skippedBreakSpaces];
}

function getLineBreaks(line: Lines[number], width: number): Range<Decoration>[] {
  const decorations: Range<Decoration>[] = [];

  const text_offset_width = mesureOffset(
    line.line.text.slice(0, line.offset.amount),
    line.offset.font
  );
  const prep = prepareRichInline(line.rich);
  let offset = line.line.from + line.offset.amount;

  let cursor = { lastIndex: 0, lastEnd: 0 };
  let isFirstLine = true;

  walkRichInlineLineRanges(prep, width - 20 - text_offset_width, (range) => {
    const line_ = materializeRichInlineLineRange(prep, range);

    const [line_text, nextCursor, skippedBreakSpaces] = reconstrucLine(
      line_.fragments,
      line.rich,
      cursor,
      isFirstLine
    );
    cursor = nextCursor;

    // Si no es la primera línea, sumamos los espacios que quedaron en el break anterior
    // y ponemos allí la decoración del salto de línea anterior
    if (!isFirstLine) {
      offset += skippedBreakSpaces;
      decorations.push(Decoration.widget({ widget }).range(offset));
      decorations.push(
        Decoration.widget({ widget: new Spacer(text_offset_width), side: 10000 }).range(offset)
      );
    }
    isFirstLine = false;

    const line_length = line_text.length;
    const absolute_pos = offset + line_length;

    if (true) {
      const pretext_line = line_text.replaceAll("\u2005", " ");
      const real_line = line.line.text.slice(
        offset - line.line.from,
        absolute_pos - line.line.from
      );
      console.assert(
        pretext_line === real_line,
        "[gnosis:breaks] Perhaps the line is not reconstructed correctly:\n" +
          `-> rl: '${real_line}'\n-> pl: '${pretext_line}'`
      );
    }

    offset = absolute_pos;
  });

  return decorations;
}

type State = {
  decorations: DecorationSet;
  width: number;
  font: string;
  lines: Lines;
  viewport: { from: number; to: number };
}

export const state_field = StateField.define<State>({
  create(): State {
    return {
      decorations: Decoration.none,
      width: 0,
      font: "16px sans-serif",
      lines: [],
      viewport: { from: 0, to: 0 }
    }
  },
  update(value, tr) {
    let { decorations, width, font, viewport, lines } = value;
    let layoutChanged = false;

    // Map decorations for document changes to keep them aligned during typing
    if (tr.docChanged) {
      decorations = decorations.map(tr.changes);
    }

    for (const ef of tr.effects) {
      if (ef.is(viewUpdateEffect)) {
        const isWidthChanged = Math.abs(ef.value.width - width) > 0.5;
        const isViewportChanged = ef.value.viewport.from !== viewport.from || ef.value.viewport.to !== viewport.to;
        
        if (isWidthChanged || isViewportChanged || ef.value.docChanged) {
          width = ef.value.width;
          viewport = ef.value.viewport;
          lines = ef.value.lines;
          layoutChanged = true;
        }
      }
    }
    
    // Only recalculate if layout dimensions or viewport changed
    if (layoutChanged && width > 0) {
      const newDecorations: Range<Decoration>[] = [];
      
      for (const line of lines/*[lines[0]!] */) {
        newDecorations.push(...getLineBreaks(line, width));
      }
      
      decorations = Decoration.set(newDecorations, true);
    }
    
    return { decorations, width, font, viewport, lines };
  },
  provide: (field) => EditorView.decorations.from(field, value => value.decorations)
})

const view_plugin = ViewPlugin.fromClass(class {
  lastWidth = 0;
  fontListener: (() => void) | null = null;
  
  constructor(public view: EditorView) { 
    // Initial dispatch after view mounts
    requestAnimationFrame(() => this.measureAndDispatch(view, true));

    if (typeof document !== 'undefined' && document.fonts) {
      const onFontsReady = () => {
        clearCache();
        requestAnimationFrame(() => {
          this.measureAndDispatch(this.view, false, true);
        });
      };
      
      document.fonts.ready.then(onFontsReady);
      
      this.fontListener = onFontsReady;
      document.fonts.addEventListener('loadingdone', onFontsReady);
    }
  }

  destroy() {
    if (this.fontListener && typeof document !== 'undefined' && document.fonts) {
      document.fonts.removeEventListener('loadingdone', this.fontListener);
    }
  }
  
  update(update: ViewUpdate) {
    const width = update.view.dom.clientWidth;
    const widthChanged = Math.abs(width - this.lastWidth) > 0.5;
    
    // Avoid triggering on raw geometryChanged, as injecting <br> triggers it
    if (update.docChanged || update.viewportChanged || widthChanged) {
      this.lastWidth = width;
      
      // requestAnimationFrame prevents "update during update" cycle warnings
      requestAnimationFrame(() => {
        this.measureAndDispatch(update.view, update.docChanged);
      });
    }
  }

  measureAndDispatch(view: EditorView, docChanged: boolean, forceAll: boolean = false) {
    const { from, to } = view.viewport;
    const startLine = (forceAll) ? view.state.doc.lineAt(from).number : 1;
    const endLine = (forceAll) ? view.state.doc.lineAt(to).number : view.state.doc.lines;
  
    const lines: Lines = [];
    const tree = syntaxTree(view.state);
  
    for (let i = startLine; i <= endLine; i++) {
      const line = view.state.doc.line(i);
      if (line.length === 0) continue;
  
      const domNode = view.domAtPos(line.from).node;
      const parentEl = (domNode.nodeType === Node.TEXT_NODE ? domNode.parentElement : domNode) as HTMLElement | null;
      const font = getLineFont(parentEl);
      
      const rawText = line.text;
      let continue_ = false;
      const richLine: RichInlineItem[] = [];
      let cursor = 0;
      let offset = 0;
      
      tree.iterate({
        from: line.from,
        to: line.to,
        enter: (node) => {
          if (SKIP_BREAKS.includes(node.name)) {
            continue_ = true;
            return false;
          }
          
          const start = Math.max(0, node.from - line.from);
          const end = Math.min(line.length, node.to - line.from);
          
          if (node.name in inlineOffsets) {
            const config = inlineOffsets[node.name as keyof typeof inlineOffsets];
            const newPos = end + config.offset;
            offset = newPos;
            cursor = Math.max(cursor, newPos);
            return true;
          }
          
          if (node.name in inlineMarks) {
            const part = inlineMarks[node.name as keyof typeof inlineMarks]!;
            const markFont = getLineFont(parentEl, {
              weight: part.weight,
              style: part.style,
              fontFamily: part.fontFamily,
            });
            
            if (cursor < start) {
              richLine.push({
                font,
                text: transformSpaces(rawText.slice(cursor, start))
              });
            }
  
            const markStart = Math.max(start, cursor);
            const markText = rawText.slice(markStart, end);
  
            if (markText.length > 0) {
              if (part.breakOn) {
                const matches = Array.from(markText.matchAll(part.breakOn));
                if (matches.length > 0) {
                  for (const match of matches) {
                    richLine.push({
                      font: markFont,
                      text: transformSpaces(match[0]),
                      break: 'never',
                      extraWidth: part.extraWidth,
                    });
                  }
                } else {
                  richLine.push({
                    font: markFont,
                    text: transformSpaces(markText),
                    break: 'never',
                    extraWidth: part.extraWidth,
                  });
                }
              } else {
                richLine.push({
                  font: markFont,
                  text: transformSpaces(markText),
                  break: 'never',
                  extraWidth: part.extraWidth,
                });
              }
            }
  
            cursor = Math.max(cursor, end);
          }
        }
      });
  
      if (continue_) continue;
      if (cursor < rawText.length) {
        richLine.push({
          font,
          text: transformSpaces(rawText.slice(cursor))
        });
      }
  
      lines.push({
        line,
        offset: {
          amount: offset,
          font,
        },
        rich: richLine,
      });
    }
    
    view.dispatch({
      effects: viewUpdateEffect.of({
        width: view.contentDOM.clientWidth,
        lines,
        viewport: {
          from: view.viewport.from,
          to: view.viewport.to
        },
        docChanged
      }),
      annotations: Transaction.addToHistory.of(false)
    });
  }
})

export function getLineFont(
  element: Element | null,
  override?: { weight?: number | string | undefined; style?: string | undefined; fontFamily?: string | undefined }
): string {
  const lineEl = element?.closest?.('.cm-line') ?? element;
  const computedStyle = lineEl && typeof window !== 'undefined' ? window.getComputedStyle(lineEl) : null;
  const style = override?.style ?? computedStyle?.fontStyle ?? 'normal';
  const weight = override?.weight ?? computedStyle?.fontWeight ?? '400';
  const size = computedStyle?.fontSize ?? '16px';
  const family = override?.fontFamily ?? computedStyle?.fontFamily ?? 'sans-serif';
  return `${style} ${weight} ${size} ${family}`;
}

function transformSpaces(str: string): string {
  return str.replace(/ {2,}/g, (match) =>
    Array.from(match)
      .map((_, i) => (i % 2 === 0 ? "\u2005" : " "))
      .join("")
  );
}

export const breakes = [
  state_field,
  view_plugin,
  EditorView.baseTheme({
    "& .cm-content": {
      // fontFamily: "Times New Roman",
      flexShrink: '1',
      overflow: 'hidden',
    },
    "@media print": {
      ".cm-break-widget": {
        display: "none !important",
      },
      ".cm-spacer-widget": {
        display: "none !important",
      },
      ".cm-content": {
        whiteSpace: "pre-wrap !important",
        wordBreak: "break-word !important",
        overflowWrap: "break-word !important",
        overflow: "visible !important",
      },
      ".cm-line": {
        whiteSpace: "pre-wrap !important",
        wordBreak: "break-word !important",
        overflowWrap: "break-word !important",
      },
    },
  }),
];
