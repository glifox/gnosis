import { EditorView } from "codemirror"

export const coreTheme = (conf) => {
    const {
        color = "black"
    } = conf || {};

    return EditorView.baseTheme({
        /* Bullet list Point */
        "& .lm.bl": {
            position: "relative",
            paddingInlineStart: "1ch",
            color: "transparent",
        },
        
        "& .lm.bl::before": {
            content: "\"\"",
            display: "inline",
            position: "absolute",
            backgroundColor: color,
            borderRadius: "50%",
            top: "50%",
            left: ".5ch",
            transform: "translate(0, -50%)",
            height: ".4em",
            width: ".4em",
        },
        "&light .lm.bl::before": { backgroundColor: "black", },
        "&dark .lm.bl::before": { backgroundColor: "white", },
        "&.cm-focused .lm.bl.sw, &.cm-focused .lm.bl.sw::before": {
            backgroundColor: "transparent",
            color: "inherit",
        },
        
        /* list text line */
        "& .ls-text-line": {
            display: "inline-block",
            ariaHidden: "true",
            // border: "red 1px solid"
        },
        
        "& .cm-line .lm, & .cm-line .TaskMark, & .cm-line .tm, & .cm-line .ls-text-line": {
            verticalAlign: "top",
        }
    });
}
