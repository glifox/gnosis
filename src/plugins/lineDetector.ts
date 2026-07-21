import { Line, StateEffect, StateField, Range, Transaction, EditorState } from "@codemirror/state";
import { Decoration, EditorView, ViewPlugin, ViewUpdate, WidgetType, type DecorationSet } from "@codemirror/view";
import { layoutWithLines, prepare, prepareWithSegments } from '@chenglou/pretext';
import { syntaxTree } from "@codemirror/language";
import { materializeRichInlineLineRange, prepareRichInline, walkRichInlineLineRanges, type RichInlineItem } from "@chenglou/pretext/rich-inline";

// Widget for the line breaks
class BreakWidget extends WidgetType {
  toDOM() { return document.createElement("br") }
  override get lineBreaks() { return 1 }
}
const widget = new BreakWidget();

class Spacer extends WidgetType {
  constructor(public text: string) { super() }
  toDOM() {
    const span = document.createElement("span")
    span.innerText = this.text;
    span.style.color = 'transparent'
    // span.style.backgroundColor = 'hsl(from red h s l / .1)'
    
    return span
  }
  override get lineBreaks() { return 0 }
  override eq(other: Spacer) {
    return other.text === this.text
  }
}


// Define a clean, serializable payload for the effect instead of the entire ViewUpdate
type LayoutUpdate = {
  width: number;
  font: string;
  lines: Lines;
  viewport: { from: number; to: number };
  docChanged: boolean;
};

type Lines = {
  line: Line,
  offset: number,
  rich: RichInlineItem[],
}[]

type Nodes = Map<string, { from: number, to: number }[]>;

const SKIP_BREAKS = [
  "CodeMark", "CodeInfo", "FencedCode", "CodeBlock",
  
]
const inlineMarks: {
  [key: string]: {
    breakOnSpace: boolean,
    extraWidth: number,
    weigth: number,
  }
} = {
  StrongEmphasis: {
    breakOnSpace: true,
    extraWidth: 0,
    weigth: 700,
  },
  Strikethrough: {
    breakOnSpace: true,
    extraWidth: 0,
    weigth: 400,
  },
  InlineCode: {
    breakOnSpace: true,
    extraWidth: 0,
    weigth: 400,
  },
  Emphasis: {
    breakOnSpace: true,
    extraWidth: 0,
    weigth: 400,
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

  const text_offset = line.line.text.slice(0, line.offset);
  const text_offset_width = mesureOffset(line.line.text.slice(0, line.offset), width, line.rich[0]!.font)
  
  const prep = prepareRichInline(line.rich);
  // console.info("prep:", prep.itemsBySourceItemIndex[2]?.prepared.segments.join(''));
  
  let offset = line.line.from + line.offset;
  walkRichInlineLineRanges(prep, width - 20 - text_offset_width, range => {
    const line_ = materializeRichInlineLineRange(prep, range)
    
    const line_text = line_.fragments.map(s => s.text).join(' ');
    const line_length = line_text.length;
    
    console.log(`'${line_text}'`)
    const absolute_pos = line_length + offset + ((line_text.endsWith(' ')) ? 0 : 1); // plus the space of every line after the fist
    offset = absolute_pos;
    
    decorations.push(Decoration.widget({ widget }).range(absolute_pos));
    decorations.push(Decoration.widget({ widget: new Spacer(text_offset), side: 10000 }).range(absolute_pos));
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
        const isFontChanged = ef.value.font !== font;
        
        if (isWidthChanged || isViewportChanged || isFontChanged || ef.value.docChanged) {
          width = ef.value.width;
          font = ef.value.font;
          viewport = ef.value.viewport;
          lines = ef.value.lines;
          layoutChanged = true;
        }
      }
    }
    
    // Only recalculate if layout dimensions or viewport changed
    if (layoutChanged && width > 0) {
      const newDecorations: Range<Decoration>[] = [];
      
      for (const line of lines) {
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
    // Extract actual CSS font values dynamically from the editor
    const computedStyle = window.getComputedStyle(view.dom);
    const font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;

    const startLine = view.state.doc.lineAt(view.viewport.from).number;
    const endLine = view.state.doc.lineAt(view.viewport.to).number;

    const lines: Lines = [];
    
    for (let i = startLine; i <= endLine; i++) {
      const line = view.state.doc.line(i);

      if (line.length < 1) continue;
      
      const computedStyle = window.getComputedStyle(view.domAtPos(line.from).node.parentElement!);
      const font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
      const text = line.text.replace(/ {2,}/g, (match) => {
        return Array.from(match)
          .map((_, i) => (i % 2 === 0 ? " " : "*"))
          .join("");
      })
      let continue_ = false;
      
      const richLine: RichInlineItem[] = [];
      let cursor = 0;
      let offset = 0;
      
      syntaxTree(view.state).iterate({
        from: line.from,
        to: line.to,
        enter: ({ name, from, to }) => {
          if (SKIP_BREAKS.includes(name)) {
            continue_ = true;
            return false;
          }
          const [ start, end ] = [from - line.from, to - line.from ]
          
          
          if (name in inlineOffsets) {
            offset = end + inlineOffsets[name as keyof typeof inlineOffsets].offset
            cursor = end;
            return true
          }
          
          if (name in inlineMarks) {
            if (cursor !== start) richLine.push({
              font,
              text: text.slice(cursor, start)
            })

            const part = inlineMarks[name as keyof typeof inlineMarks]!;
            if (part.breakOnSpace) {
              const text_ = text.slice(start, end);
              for (const match of text_.matchAll(breaks_regex)) {
                richLine.push({
                  font: `${part.weigth} ${font}`,
                  text: match.toString(),
                  break: 'never',
                  extraWidth: part.extraWidth,
                })
              }
            }
            else richLine.push({
              font: `${part.weigth} ${font}`,
              text: text.slice(start, end),
              break: 'never',
              extraWidth: part.extraWidth,
            })
            
            cursor = end;
          }
        }
      });
      if (continue_) continue;
      if (cursor < line.text.length) richLine.push({
        font,
        text: text.slice(cursor, line.text.length)
      })

      lines.push({
        line: line,
        offset: offset,
        rich: richLine,
      })
    }
    
    view.dispatch({
      effects: viewUpdateEffect.of({
        width: view.dom.clientWidth,
        font: font,
        lines: lines,
        viewport: {
          from: view.viewport.from,
          to: view.viewport.to
        },
        docChanged
      }),
      // Essential: Prevent scroll updates from filling up the undo history
      annotations: Transaction.addToHistory.of(false)
    });
  }
})

export const breakes = [
  state_field,
  view_plugin,
  
];
