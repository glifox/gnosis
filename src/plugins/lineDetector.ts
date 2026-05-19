import { Decoration, EditorView, ViewPlugin, ViewUpdate, WidgetType, type DecorationSet } from "@codemirror/view";
import { PluginFactory } from "../utils";
import { prepare, layout, layoutWithLines, prepareWithSegments } from '@chenglou/pretext';
import { StateEffect, StateField } from "@codemirror/state";

const widget = new class extends WidgetType {
  toDOM() { return document.createElement("br") }
  override get lineBreaks() { return 1 }
}

const actualizarAnchoEfecto = StateEffect.define<number>()

export const state_field = StateField.define({
  create(state) {
    return {
      ancho: 0,
      decorations: Decoration.set(Decoration.widget({ widget }).range(20))
    }
  },
  update(value, tr) {
    // Si el documento cambia, recalculamos los saltos según el árbol sintáctico actualizado
    console.info("tr:", tr);
    if (tr.docChanged) {
      return {
        ancho: 0,
        decorations: Decoration.set(Decoration.widget({ widget }).range(20))
      }
    }
    // Si no cambia el documento, mapeamos las posiciones existentes con los cambios del usuario
    return {
      ancho: 0,
      decorations: value.decorations.map(tr.changes)
    }
  },
  // Aquí ocurre la magia: Le proveemos las decoraciones de estructura directamente al Facet de la vista
  provide: (field) => EditorView.decorations.from(field, value => value.decorations)
})

const view_plugin = ViewPlugin.fromClass(class {
    observer
    constructor(public view: EditorView) {
  
      this.observer = new ResizeObserver(entries => {
        for (let entry of entries) {
          // Obtenemos el ancho real actual del DOM
          const nuevoAncho = entry.contentRect.width
  
          // Obtenemos el ancho que tenemos guardado actualmente en el Estado
          const anchoActualEnEstado = this.view.state.field(state_field).ancho
  
          // Condición crítica: Solo disparamos si el ancho realmente cambió.
          // Usamos un margen de 0.5px para evitar bucles infinitos por sub-píxeles o barras de scroll.
          if (Math.abs(nuevoAncho - anchoActualEnEstado) > 0.5) {
            
            // ¡Aquí forzamos la transacción manual!
            this.view.dispatch({
              effects: actualizarAnchoEfecto.of(nuevoAncho)
            })
          }
        }
      })
  
      // Empezamos a escuchar el elemento raíz del editor
      this.observer.observe(view.dom)
    }
  
    destroy() {
      // Muy importante apagar el observer si el editor se destruye
      this.observer.disconnect()
    }
  })

export const breakes = [ state_field, view_plugin ]