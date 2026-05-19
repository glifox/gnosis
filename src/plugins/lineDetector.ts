import { Decoration, EditorView, ViewPlugin, ViewUpdate, WidgetType, type DecorationSet } from "@codemirror/view";
import { PluginFactory } from "../utils";
import { layoutWithLines, prepareWithSegments } from '@chenglou/pretext';
import { EditorState, Line, Range, StateEffect, StateField } from "@codemirror/state";

const widget = new class extends WidgetType {
  toDOM() { return document.createElement("br") }
  override get lineBreaks() { return 1 }
}

const actualizarAnchoEfecto = StateEffect.define<number>()
type Effect = {
  width: number,
  font: string,
}

type State = {
    width: number;
    font: string;
    decorations: DecorationSet;
}

function getLineBreaks(state: State, line: Line): Range<Decoration>[] {
  const prep = prepareWithSegments(line.text, state.font);
  const seg = layoutWithLines(prep, state.width, 1);
  
  console.info("seg:", seg);
  let offset = line.from;
  return seg.lines.slice(0, -1).map(line => {
    const target = line.text.length + offset;
    
    offset = target
    return Decoration.widget({ widget }).range(target);
  }) 
}

function getLineDecorators(state: State, eState: EditorState) {
  const decorations: Range<Decoration>[] = [];

  const lines = eState.doc.lines;
  for (let index = 1; index < lines; index++) {
    decorations.push(...getLineBreaks(state, eState.doc.line(index)))
  }
  return Decoration.set(decorations, true)
}

export const state_field = StateField.define({
  create(eState): State {
    const state: State = {
      width: 400,
      font: '16px Inter',
      decorations: Decoration.none
    }

    return {
      ...state,
      decorations: getLineDecorators(state, eState)
    }
  },
  update(value, tr) {
    for (const ef of tr.effects) {
      if (ef.is(actualizarAnchoEfecto)) {
        
      }
    }
    
    if (tr.docChanged) {
      return {
        ...value,
        decorations: getLineDecorators(value, tr.state)
      }
    }
    
    return {
      ...value,
      decorations: value.decorations.map(tr.changes)
    }
  },
  provide: (field) => EditorView.decorations.from(field, value => value.decorations)
})

const view_plugin = ViewPlugin.fromClass(class {
    observer
    constructor(public view: EditorView) {
  
      this.observer = new ResizeObserver(entries => {
        for (let entry of entries) {
          const nuevoAncho = entry.contentRect.width
          const anchoActualEnEstado = this.view.state.field(state_field).width
          
          if (Math.abs(nuevoAncho - anchoActualEnEstado) > 0.5) {
            this.view.dispatch({
              effects: actualizarAnchoEfecto.of(nuevoAncho)
            })
          }
        }
      })
      
      this.observer.observe(view.dom)
    }
  
    destroy() { this.observer.disconnect() }
  })

export const breakes = [state_field, view_plugin]
