import { Decoration, EditorView, WidgetType } from "@codemirror/view";
import { PluginFactory } from "../utils";
import { prepare, layout, layoutWithLines, prepareWithSegments } from '@chenglou/pretext';

const widget = new class extends WidgetType {
  toDOM() { return document.createElement("br") }
  override get lineBreaks() { return 1 }
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
        widget
      }).range(current)
    })
    
    return Decoration.set(widgets.slice(0, -1))

    // return Decoration.set([])
  },
  null, {}
)
