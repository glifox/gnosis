import { EditorView } from "codemirror"

export const coreTheme = EditorView.baseTheme({
    "& .cm-html-widget": {
        all: "unset",
        // outline: "red solid 2px",
    },
    "& .cm-html-widget > *": {
        paddingTop: "0",
        paddingBottom: "0",
        marginBottom: "0",
        marginTop: "0",
    },
    "& .cm-widgetBuffer": { display: "none" }
})
