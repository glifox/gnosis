import { EditorView } from "codemirror"

export const headingTheme = EditorView.baseTheme({
    "& .h1 ": { fontSize: "2.00em", fontWeight: "bolder" },
    "& .h2 ": { fontSize: "1.55em", fontWeight: "bolder" },
    "& .h3 ": { fontSize: "1.35em", fontWeight: "bolder" },
    "& .h4 ": { fontSize: "1.25em", fontWeight: "bolder" },
    "& .h5 ": { fontSize: "1.25em", fontWeight: "semi-bold" },
    "& .h6 ": { fontSize: "1.25em", fontWeight: "normal" },
    "& .hg ": { lineHeight: "2.4lh"},
    
    "& .h1, & .h2": { paddingBottom: "16px", position: "relative", },
    "& .h1::after, & .h2::after": { 
      content: "\"\"", 
      display: "block", 
      height: "1px",
      borderBottom: "1px solid var(--cm-border, light-dark(#ddd, #555))", 
    },
})

export const coreTheme = EditorView.baseTheme({
    "& .hg .mk": { display: "none" },
    "&.cm-focused .hg.sw .mk": { display: "inline" },
})
