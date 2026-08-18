import { EditorState, Extension } from "@codemirror/state";
import { EditorView, minimalSetup } from "codemirror";
import { gnosis } from "../../src/lib";

export const Editor = ({ 
  text,
  save = false, 
  key = '',
  extensions,
}: {
  text: string,
  save?: boolean,
  key?: string,
  extensions?: Extension[],
}) => {
    const savedContent = localStorage.getItem(key);
    const initialContent = savedContent !== null ? savedContent : text;
    
    const view = new EditorView({
        doc: initialContent,
        extensions: [
            gnosis(),
            minimalSetup,
            EditorView.clickAddsSelectionRange.of(e => e.altKey),
            EditorState.allowMultipleSelections.of(true),
            save ? EditorView.updateListener.of(update => {
                if (update.docChanged) {
                    const content = update.state.doc.toString();
                    localStorage.setItem(key, content);
                }
            }) : [],
            EditorView.theme({
                "&": { width: "100%", height: "100%" },
                "& .cm-line": {
                    fontFamily: "Geist, Times New Roman, serif !important",
                }
            }, { dark: true }),
            extensions ?? [],
        ],
        parent: document.querySelector(".editor")!
    });
    
    return view;
};
