import { EditorView } from "codemirror"

export const coreTheme = (conf) => {
    const {
        color = "black"
    } = conf || {};

    return EditorView.baseTheme({
        ".hr": { position: "relative" },
        ".hr    > .mk": { fontSize: "0" },
        ".hr.sw > .mk": { fontSize: "inherit" },
        ".hr::before": {
            content: "\"\"",
            position: "absolute",
            width: "calc(100% - 12px)",
            height: ".2ch",
            backgroundColor: color
        },
        ".hr.sw::before": { width: "0", height: "0" }
    });
}
