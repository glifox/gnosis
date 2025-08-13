import { EditorView } from "codemirror"

export const coreTheme = () => {
    return EditorView.baseTheme({
        "& .lm.bl": {
            position: "relative",
            // paddingInlineStart: "1ch",
            color: "transparent",
        },
        
        "& .lm.bl::before": {
            content: "\"\"",
            display: "inline",
            position: "absolute",
            borderRadius: "50%",
            top: "50%",
            left: ".5ch",
            transform: "translate(0, -50%)",
            height: ".4em",
            width: ".4em",
        },
        
        "&light .lm.bl::before": { 
            backgroundColor: "var(--cm-list-bullet, light-dark(black, white))",
        },
        
        "&dark .lm.bl::before": { 
            backgroundColor: "var(--cm-list-bullet, light-dark(black, white))",
        },
        
        "&.cm-focused .lm.bl.sw, &.cm-focused .lm.bl.sw::before": {
            backgroundColor: "transparent",
            color: "inherit"
        },
        
        /* list text line */
        "& .ls-text-line": {
            display: "inline-block",
            ariaHidden: "true",
        },
        
        "& .cm-line .lm, & .cm-line .TaskMark, & .cm-line .tm, & .cm-line .ls-text-line": {
            verticalAlign: "top",
        },
        
        "& .cb-content .ls-text-line, & .cb-spacer .ls-text-line": {
            width: "unset !important",
        },
    });
}
