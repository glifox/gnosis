import { htmlBlockField, decorator, updateHtmlBlocks } from "./decorations";
import { EditorView } from "@codemirror/view";
import { coreTheme } from "./theme";

const htmlPlugin = EditorView.updateListener.of((update) => {
    if (
        update.selectionSet || 
        update.docChanged || 
        update.focusChanged ||
        update.geometryChanged
    ) {
        const decorations = decorator(update.view);
        update.view.dispatch({ effects: updateHtmlBlocks.of(decorations) });
    }
});

export const HtmlPlugin = () => {
  return [
    htmlBlockField,
    htmlPlugin,
    coreTheme
  ]
};