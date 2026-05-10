import { EditorState } from "@codemirror/state";
import { EditorView, minimalSetup } from "codemirror"
import { gnosis } from "../src/lib"

export const Editor = (text: string, save: boolean = false, key = '') => {
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
                "& .cm-line": {
                    // fontFamily: "Times New Roman, serif !important",
                }
            }),
        ],
        parent: document.querySelector(".editor")!
    });
    
    return view;
};
