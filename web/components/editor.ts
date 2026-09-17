import { EditorState, type Extension } from "@codemirror/state";
import { EditorView, } from "@codemirror/view";
import { basicSetup, minimalSetup } from "codemirror";
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
            extensions ?? [],
            EditorView.clickAddsSelectionRange.of(e => e.altKey),
            EditorState.allowMultipleSelections.of(true),
            save ? EditorView.updateListener.of(update => {
                if (update.docChanged) {
                    const content = update.state.doc.toString();
                    localStorage.setItem(key, content);
                }
            }) : [],
            EditorView.theme({
              "&": {
                width: "100%", height: "100%",
                outline: "unset"
              },
                "& .cm-line": {
                    fontFamily: "Geist, Times New Roman, serif !important",
                },
                "& .cm-line .cm-codeblock-content": {
                    fontFamily: "Jetbrains Mono, monospace !important",
                }
            }, { dark: true }),
        ],
        parent: document.querySelector(".editor")!
    });
    
    return view;
};
