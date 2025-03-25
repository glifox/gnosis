import { EditorView } from "codemirror";

export const coreTheme = EditorView.baseTheme({
    ".lk-mk, .link > .lk-url": { display: "none" },
    "&.cm-focused .link.sw .lk-mk, &.cm-focused .link.sw .lk-url": { display: "inherit" }
})
