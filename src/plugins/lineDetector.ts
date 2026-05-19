import { Decoration, EditorView, WidgetType } from "@codemirror/view";
import { PluginFactory } from "../utils";
import { prepare, layout, layoutWithLines, prepareWithSegments } from '@chenglou/pretext';

class MyWrapWidget extends WidgetType {
  toDOM() {
    let wrap = document.createElement("span")
    wrap.innerHTML = " ↵<br>" 
    wrap.className = "my-custom-wrap-widget"
    return wrap
  }
}

export const breakes = PluginFactory(
  (view) => {
    
    const linea = view.state.doc.line(1);

    const prepared = prepareWithSegments(linea.text, '16px Inter');
    console.info("prepared:", prepared);
    const testnt = layoutWithLines(prepared, view.dom.offsetWidth, 1);
  
    let current = linea.from;
    const widgets = testnt.lines.map((line) => {
      current += line.text.length
      return Decoration.widget({
        widget: new MyWrapWidget(),
        side: 1 // Aparece al final de la línea visual
      }).range(current)
    })
    
    return Decoration.set(widgets)

    // return Decoration.set([])
  },
  null, {}
)
