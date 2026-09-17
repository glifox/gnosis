import { EditorView } from "@codemirror/view";


export const core = () => EditorView.baseTheme({
  ".cm-heading"  : { lineHeight: "2.4lh" },
  ".cm-heading1" : { fontSize: "2.00em", fontWeight: "bolder" },
  ".cm-heading2" : { fontSize: "1.55em", fontWeight: "bolder" },
  ".cm-heading3" : { fontSize: "1.35em", fontWeight: "bolder" },
  ".cm-heading4" : { fontSize: "1.25em", fontWeight: "bolder" },
  ".cm-heading5" : { fontSize: "1.25em", fontWeight: "semi-bold" },
  ".cm-heading6" : { fontSize: "1.25em", fontWeight: "normal" },
})
