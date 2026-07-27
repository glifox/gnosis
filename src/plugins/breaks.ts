import { Line, StateEffect, StateField, Range, Transaction, EditorState } from "@codemirror/state";
import { Decoration, EditorView, ViewPlugin, ViewUpdate, WidgetType, type DecorationSet } from "@codemirror/view";
import { prepare } from '@chenglou/pretext';
import { syntaxTree } from "@codemirror/language";
import { materializeRichInlineLineRange, prepareRichInline, walkRichInlineLineRanges, type RichInlineItem } from "@chenglou/pretext/rich-inline";

// Widget for the line breaks
class BreakWidget extends WidgetType {
  toDOM() { return document.createElement("br") }
  override get lineBreaks() { return 1 }
}
const widget = new BreakWidget();

class Spacer extends WidgetType {
  constructor(public width: number) { super() }
  toDOM() {
    const span = document.createElement("span")
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
const inlineMarks: {
  [key: string]: {
    breakOnSpace: boolean,
    extraWidth: number,
    weight: number,
  }
} = {
  StrongEmphasis: {
    breakOnSpace: true,
    extraWidth: 0,
    weight: 700,
  },
  Strikethrough: {
    breakOnSpace: true,
    extraWidth: 0,
    weight: 400,
  },
  InlineCode: {
    breakOnSpace: true,
    extraWidth: 0,
    weight: 400,
  },
  Emphasis: {
    breakOnSpace: true,
    extraWidth: 0,
    weight: 400,
  },
}
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
const breaks_regex = /\s*\S+/g;
const viewUpdateEffect = StateEffect.define<LayoutUpdate>();

function mesureOffset(offset: string, width: number, font: string): number {
  const text = offset.replaceAll(' ', 's')
  const prep = prepare(text, font)
  return (prep as any as { widths: number[] }).widths.reduce((cur, add) => add += cur ,0)
}
function getLineBreaks(line: Lines[number], width: number): Range<Decoration>[] {
  const decorations: Range<Decoration>[] = []

  const text_offset_width = mesureOffset(line.line.text.slice(0, line.offset.amount), width, line.offset.font)
  const prep = prepareRichInline(line.rich);
  
  let offset = line.line.from + line.offset.amount;
  
  walkRichInlineLineRanges(prep, width - 20 - text_offset_width, range => {
    const line_ = materializeRichInlineLineRange(prep, range)
    
    const line_text = line_.fragments
      .map(curr => `${curr.gapBefore === 0 ? '' : ' '}${curr.text}`)
      .join('');
    
    const line_length = line_text.length;
    const absolute_pos = line_length + offset;

    if (true) {
      const pretext_line = line_text.replaceAll('\u2005', ' ')
      const real_line = line.line.text.slice(offset - line.line.from, absolute_pos - line.line.from)
      console.assert(
        pretext_line === real_line,
        '[gnosis:breaks] Perhaps the line is not reconstructed correctly:\n' + `-> rl: '${real_line}'\n-> pl: '${pretext_line}'`)
    }
    
    // Solución: Inspeccionar el caracter exacto en el texto original
    // console.info(`pretext_line: '${pretext_line}'`);
    const charAtBreak = transformSpaces(line.line.text)[absolute_pos - line.line.from];
    // console.info(`charAtBreak: '${charAtBreak}'`);
    offset = absolute_pos + (charAtBreak === ' ' ? 1 : 0);
    
    decorations.push(Decoration.widget({ widget }).range(offset));
    decorations.push(Decoration.widget({ widget: new Spacer(text_offset_width), side: 10000 }).range(offset));
  })
  
  return decorations.slice(0, -2)
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
  
  constructor(public view: EditorView) { 
    // Initial dispatch after view mounts
    requestAnimationFrame(() => this.measureAndDispatch(view, true));
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

  measureAndDispatch(view: EditorView, docChanged: boolean) {
    const { from, to } = view.viewport;
    const startLine = view.state.doc.lineAt(from).number;
    const endLine = view.state.doc.lineAt(to).number;
  
    const lines: Lines = [];
    const tree = syntaxTree(view.state);
  
    for (let i = startLine; i <= endLine; i++) {
      const line = view.state.doc.line(i);
      if (line.length === 0) continue;
  
      const domNode = view.domAtPos(line.from).node;
      const parentEl = (domNode.nodeType === Node.TEXT_NODE ? domNode.parentElement : domNode) as HTMLElement | null;
      const computedStyle = parentEl ? window.getComputedStyle(parentEl) : null;
      const font = computedStyle ? `${computedStyle.fontSize} ${computedStyle.fontFamily}` : "16px sans-serif";
      
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
            
            if (cursor < start) {
              richLine.push({
                font,
                text: transformSpaces(rawText.slice(cursor, start))
              });
            }
  
            const markStart = Math.max(start, cursor);
            const markText = rawText.slice(markStart, end);
  
            if (markText.length > 0) {
              if (part.breakOnSpace) {
                const matches = Array.from(markText.matchAll(breaks_regex));
                if (matches.length > 0) {
                  for (const match of matches) {
                    richLine.push({
                      font: `${part.weight} ${font}`,
                      text: transformSpaces(match[0]),
                      break: 'never',
                      extraWidth: part.extraWidth,
                    });
                  }
                } else {
                  richLine.push({
                    font: `${part.weight} ${font}`,
                    text: transformSpaces(markText),
                    break: 'never',
                    extraWidth: part.extraWidth,
                  });
                }
              } else {
                richLine.push({
                  font: `${part.weight} ${font}`,
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
        width: view.dom.clientWidth,
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

function transformSpaces(str: string): string {
  return str.replace(/ {2,}/g, (match) =>
    Array.from(match)
      .map((_, i) => (i % 2 === 0 ? " " : "\u2005"))
      .join("")
  );
}

export const breakes = [
  state_field,
  view_plugin,
  EditorView.baseTheme({
    "& .cm-content": {
      flexShrink: '1',
      overflow: 'hidden',
    },
  }),
];
