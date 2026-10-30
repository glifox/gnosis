import { dynamicTheme, reconfig } from '@feraxjs/themes-codemirror';
import { EditorView, minimalSetup } from "codemirror";
import { Compartment, EditorState, type Extension } from "@codemirror/state";
import { lineNumbers, highlightActiveLineGutter } from "@codemirror/view";
import { gnosis } from "../src/lib";

export const gutterCompartment = new Compartment();

export const defaultGutterExtensions: Extension = [
    lineNumbers(),
    highlightActiveLineGutter(),
];

export const Editor = (text: string, save: boolean = false, key = '', showGutter: boolean = true) => {
    const savedContent = key ? localStorage.getItem(key) : null;
    const initialContent = savedContent !== null ? savedContent : text;
    
    const view = new EditorView({
        doc: initialContent,
        extensions: [
            gnosis(),
            minimalSetup,
            gutterCompartment.of(showGutter ? defaultGutterExtensions : []),
            dynamicTheme(),
            EditorView.clickAddsSelectionRange.of(e => e.altKey),
            EditorState.allowMultipleSelections.of(true),
            save && key ? EditorView.updateListener.of(update => {
                if (update.docChanged) {
                    const content = update.state.doc.toString();
                    localStorage.setItem(key, content);
                }
            }) : [],
            EditorView.theme({
                "&": {
                    width: "100%",
                    height: "100%",
                    outline: "unset",
                },
                "& .cm-line": {
                    fontFamily: "'Geist', var(--sans), sans-serif !important",
                },
                "& .cm-line .cm-codeblock-content, & .cm-codeblock-scroller, & .cm-codeblock-header, & .cm-inline-code": {
                    fontFamily: "'JetBrains Mono', var(--mono), monospace !important",
                }
            }, { dark: true }),
        ],
        parent: document.querySelector(".editor")!
    });
    
    reconfig(view);
    
    return view;
};
