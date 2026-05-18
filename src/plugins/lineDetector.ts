import { Decoration, EditorView } from "@codemirror/view";
import { PluginFactory } from "../utils";
import {WidgetType} from "@codemirror/view"

class MyWrapWidget extends WidgetType {
  toDOM() {
    let wrap = document.createElement("span")
    wrap.innerHTML = " ↵ " // El símbolo o elemento que quieras mostrar
    wrap.className = "my-custom-wrap-widget"
    return wrap
  }
}

export const breakes = PluginFactory(
  (view) => {
    const block = obtenerSaltosVisuales(view, 1)
    // const block = view.state.doc.lineAt(0);
    console.info("block:", block);
    
    // return Decoration.set(Decoration.widget({
    //   widget: new MyWrapWidget(),
    //   side: 1 // Aparece al final de la línea visual
    // }).range(block.to))

    return Decoration.set([])
  },
  null, {}
)

function obtenerSaltosVisuales(view: EditorView, numeroDeLineaLogica: number) {
  // 1. Obtenemos la línea lógica del estado del editor
  const linea = view.state.doc.line(numeroDeLineaLogica);
  const saltos = [];
  
  let alturaYPrevia = null;

  // 2. Iteramos sobre cada posición dentro de esa línea
  for (let pos = linea.from; pos <= linea.to; pos++) {
    // Obtenemos las coordenadas en pantalla de esa posición exacta
    const coords = view.coordsAtPos(pos);
    
    if (!coords) continue; // Si la posición no es visible, la ignoramos

    // 3. Comparamos la altura (top) actual con la anterior
    if (alturaYPrevia !== null) {
      // Usamos un pequeño margen de tolerancia (ej. > 5px) para evitar
      // falsos positivos por sub-píxeles o renderizado de fuentes
      if (coords.top > alturaYPrevia + 5) {
        saltos.push(pos); // ¡Hemos encontrado un salto visual!
      }
    }
    
    alturaYPrevia = coords.top;
  }

  return saltos; // Devuelve un array con las posiciones del documento donde la línea hace "wrap"
}