import { EditorView } from "codemirror"

export const coreTheme = () => {
    
    return EditorView.baseTheme({
        "& .hr": { position: "relative" },
        "& .hr    > .mk": { fontSize: "0" },
        "& .hr.sw > .mk": { fontSize: "inherit" },
        "&light .hr::before ": { backgroundColor: "var(--cm-hr, black)" },
        "&dark  .hr::before ": { backgroundColor: "var(--cm-hr, white)" },
        "&.cm-focused .hr.sw::before": { width: "0", height: "0" },
        "& .hr::before": {
            content: "\"\"",
            position: "absolute",
            width: "calc(100% - 12px)",
            height: ".2ch",
        },
    });
}
