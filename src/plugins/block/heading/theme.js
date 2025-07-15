import { EditorView } from "codemirror"

export const headingTheme = EditorView.baseTheme({
    "& .h1 ": { fontSize: "2.00em", fontWeight: "bolder" },
    "& .h2 ": { fontSize: "1.55em", fontWeight: "bolder" },
    "& .h3 ": { fontSize: "1.35em", fontWeight: "bolder" },
    "& .h4 ": { fontSize: "1.25em", fontWeight: "bolder" },
    "& .h5 ": { fontSize: "1.25em", fontWeight: "semi-bold" },
    "& .h6 ": { fontSize: "1.25em", fontWeight: "normal" },
    "& .hg ": { lineHeight: "1.5lh"}
})

export const coreTheme = EditorView.baseTheme({
    "& .hg .mk": { fontSize: "0" },
    "&.cm-focused .hg.sw .mk": { fontSize: "inherit" },
})
