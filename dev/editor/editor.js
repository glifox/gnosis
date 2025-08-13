import { EditorView, minimalSetup } from "codemirror"
import { EditorState } from "@codemirror/state";

import { gnosis } from "../../src/exports";

export const Editor = (text, save = false, key = 'gnosis-editor-content') => {
    const savedContent = localStorage.getItem(key);
    const initialContent = savedContent !== null ? savedContent : text;
    
    const view = new EditorView({
        doc: initialContent,
        extensions: [
            minimalSetup,
            EditorView.lineWrapping,
            EditorView.clickAddsSelectionRange.of(e => e.altKey),
            EditorState.allowMultipleSelections.of(true),
            gnosis(),
            save ? EditorView.updateListener.of(update => {
                if (update.docChanged) {
                    const content = update.state.doc.toString();
                    localStorage.setItem(key, content);
                }
            }) : [],
        ],
        parent: document.querySelector(".editor")
    });
    
    return view;
};