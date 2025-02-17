import { EditorView } from "codemirror";

export const inlineTheme = EditorView.baseTheme({
    ".it ": { fontStyle: "italic" },    
    ".st ": { fontWeight: "bold" },
    ".sk ": { textDecoration: "line-through" },    
    ".ic ": { 
        fontFamily: "monospace",
        paddingInline: ".6ch",
        borderRadius: ".6ch",
    },
})

export const coreTheme = EditorView.baseTheme({
    ".il .mkl": { fontSize: "0" },
    ".il.sw .mkl": { fontSize: "inherit" },
})
