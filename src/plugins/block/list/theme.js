import { EditorView } from "codemirror"

export const coreTheme = () => {
    return EditorView.baseTheme({
        "& .lm.bl": {
            position: "relative",
            paddingInlineStart: "1ch",
            color: "transparent",
        },
        
        "& .lm.bl::before": {
            content: "\"\"",
            display: "inline",
            position: "absolute",
            borderRadius: "50%",
            top: "0",
            left: ".5ch",
            transform: "translate(0, .4lh)",
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
            
            ariaHidden: "true",
        },
        
        "& .cm-line:has(.lm)": {
            display: "list-item flow-root",
            backgroundColor: "hsl(from red h s l / .05)",
            ariaHidden: "true",
        },
    });
}
