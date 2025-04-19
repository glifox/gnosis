import { EditorView } from "codemirror";

export const coreTheme = () => {
    const width = "4px";
    return EditorView.baseTheme({
        "& .qt-mk": {
            // outline: "1px red solid",
            position: "relative",
            color: "transparent",
            verticalAlign: "top",
        },
        "& .qt-mk::after": {
            position: "absolute",
            content: '" "', // Las comillas dobles dentro de la cadena son necesarias
            backgroundColor: "currentColor",
            top: "-100vh",
            width: width,
            height: "200vh",
            zIndex: "-1",
        },
        "& .bq-line": { lineHeight: "1.2lh", overflowY: "hidden" },
        "&.cm-focused .bq-line.sw .bq-none-mark, .bq-none-mark::after": { color: "var(--bq-none-mark)", },
        "&.cm-focused .bq-line.sw .bq-note-mark, .bq-note-mark::after": { color: "var(--bq-note-mark)", },
        "&.cm-focused .bq-line.sw .bq-tip-mark, .bq-tip-mark::after": { color: "var(--bq-tip-mark)", },
        "&.cm-focused .bq-line.sw .bq-warning-mark, .bq-warning-mark::after": { color: "var(--bq-warning-mark)", },
        "&.cm-focused .bq-line.sw .bq-important-mark, .bq-important-mark::after": { color: "var(--bq-important-mark)", },
        "&.cm-focused .bq-line.sw .bq-caution-mark, .bq-caution-mark::after": { color: "var(--bq-caution-mark)", },
        
        "& .bq-text-line": { 
            lineHeight: "1lh",
            // backgroundColor: "rgba(0, 0, 0, 0.1)",
            display: "inline-block",
            // maxWidth: "95%",
            paddingLeft: "6px",
            textIndent: "-7px",
            ariaHidden: "true"
        },
    });
};
