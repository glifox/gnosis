import { Line, StateEffect, StateField, Range, Transaction, EditorState } from "@codemirror/state";
import { Decoration, EditorView, ViewPlugin, ViewUpdate, WidgetType, type DecorationSet } from "@codemirror/view";
import { layoutWithLines, prepareWithSegments } from '@chenglou/pretext';
import { syntaxTree } from "@codemirror/language";
import type { RichInlineItem } from "@chenglou/pretext/rich-inline";

// Widget for the line breaks
class BreakWidget extends WidgetType {
  toDOM() { return document.createElement("br") }
  override get lineBreaks() { return 1 }
}
const widget = new BreakWidget();

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
  nodes: Nodes,
  font: string,
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
  "StrongEmphasis": {
    breakOnSpace: true,
    extraWidth: 0,
    weigth: 700,
  },
  "Strikethrough": {
    breakOnSpace: true,
    extraWidth: 0,
    weigth: 400,
  },
  "InlineCode": {
    breakOnSpace: true,
    extraWidth: 0,
    weigth: 400,
  },
  "Emphasis": {
    breakOnSpace: true,
    extraWidth: 0,
    weigth: 400,
  },
}
const breaks_regex = /\s*\S+/g;
const viewUpdateEffect = StateEffect.define<LayoutUpdate>();

function getLineBreaks(line: Lines[number], width: number): Range<Decoration>[] {
  const prep = prepareWithSegments(
    line.line.text,
    line.font,
    {
      wordBreak: 'keep-all',
      whiteSpace: 'pre-wrap',
    }
  );
  const seg = layoutWithLines(prep, width - 12, 1);
  
  let offset = line.line.from;
  // Use .slice(0, -1) to avoid rendering an extra break at the end of the line
  return seg.lines.slice(0, -1).map(l => {
    const target = l.text.length + offset;
    offset = target;
    return Decoration.widget({ widget }).range(target);
  });
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

      let continue_ = false;
      
      const richLine: RichInlineItem[] = [];
      let cursor = 0;
      
      syntaxTree(view.state).iterate({
        from: line.from,
        to: line.to,
        enter: ({ name, from, to }) => {
          if (SKIP_BREAKS.includes(name)) {
            continue_ = true;
            return false;
          }
          const [ start, end ] = [from - line.from, to - line.from ]
          
          if (name in inlineMarks) {
            if (cursor !== start) richLine.push({
              font,
              text: line.text.slice(cursor, start)
            })

            const part = inlineMarks[name as keyof typeof inlineMarks]!;
            if (part.breakOnSpace) {
              const text = line.text.slice(start, end);
              for (const match of text.matchAll(breaks_regex)) {
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
              text: line.text.slice(start, end),
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
        text: line.text.slice(cursor, line.text.length)
      })
    }
    
    
    // view.dispatch({
    //   effects: viewUpdateEffect.of({
    //     width: view.dom.clientWidth,
    //     font: font,
    //     lines: lines,
    //     viewport: {
    //       from: view.viewport.from,
    //       to: view.viewport.to
    //     },
    //     docChanged
    //   }),
    //   // Essential: Prevent scroll updates from filling up the undo history
    //   annotations: Transaction.addToHistory.of(false)
    // });
  }
})

export const breakes = [
  state_field,
  view_plugin,
  
];
