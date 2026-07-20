import { Line, StateEffect, StateField, Range, Transaction } from "@codemirror/state";
import { Decoration, EditorView, ViewPlugin, ViewUpdate, WidgetType, type DecorationSet } from "@codemirror/view";
import { layoutWithLines, prepareWithSegments } from '@chenglou/pretext';

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
  viewport: { from: number; to: number };
  docChanged: boolean;
};

const viewUpdateEffect = StateEffect.define<LayoutUpdate>();

function getLineBreaks(line: Line, width: number, font: string): Range<Decoration>[] {
  const prep = prepareWithSegments(line.text, font);
  const seg = layoutWithLines(prep, width - 12, 1);
  
  let offset = line.from;
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
  viewport: { from: number; to: number };
}

export const state_field = StateField.define<State>({
  create(): State {
    return {
      decorations: Decoration.none,
      width: 0,
      font: "16px sans-serif",
      viewport: { from: 0, to: 0 }
    }
  },
  update(value, tr) {
    let { decorations, width, font, viewport } = value;
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
          layoutChanged = true;
        }
      }
    }
    
    // Only recalculate if layout dimensions or viewport changed
    if (layoutChanged && width > 0) {
      const newDecorations: Range<Decoration>[] = [];
      
      // Get exact line ranges based on the current visible viewport
      const startLine = tr.state.doc.lineAt(viewport.from).number;
      const endLine = tr.state.doc.lineAt(viewport.to).number;

      for (let i = startLine; i <= endLine; i++) {
        const line = tr.state.doc.line(i);
        // Skip empty lines to save processing time
        if (line.length > 0) {
          newDecorations.push(...getLineBreaks(line, width, font));
        }
      }
      
      decorations = Decoration.set(newDecorations, true);
    }
    
    return { decorations, width, font, viewport };
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
    
    view.dispatch({
      effects: viewUpdateEffect.of({
        width: view.dom.clientWidth,
        font: font,
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

export const breakes = [state_field, view_plugin];
