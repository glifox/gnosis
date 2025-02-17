import { EditorView } from "codemirror"

export const headingTheme = EditorView.baseTheme({
    ".h1 ": { fontSize: "2.6rem" },
    ".h2 ": { fontSize: "2.0rem" },
    ".h3 ": { fontSize: "1.8rem" },
    ".h4 ": { fontSize: "1.6rem" },
    ".h5 ": { fontSize: "1.4rem" },
    ".h6 ": { fontSize: "1.2rem" },
})

export const coreTheme = EditorView.baseTheme({
    ".hg .mk": { fontSize: "0" },
    ".hg.sw .mk": { fontSize: "inherit" },
})
