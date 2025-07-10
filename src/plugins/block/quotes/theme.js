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
            content: '" "',
            backgroundColor: "currentColor",
            top: "-100vh",
            width: width,
            height: "200vh",
            zIndex: "-1",
        },
        "&.cm-focused .bq-line.sw .qt-mk::after": {
            opacity: 0.3
        },
        "& .bq-line": { lineHeight: "1.2lh", overflowY: "hidden" },
        "& .bq-line.sw .bq-none-mark, .bq-none-mark::after": { color: "var(--bq-none-mark, light-dark(black, white))", },
        "&.cm-focused .bq-line.sw .bq-note-mark, .bq-note-mark::after": { color: "var(--bq-note-mark, blue)", },
        "&.cm-focused .bq-line.sw .bq-tip-mark, .bq-tip-mark::after": { color: "var(--bq-tip-mark, green)", },
        "&.cm-focused .bq-line.sw .bq-warning-mark, .bq-warning-mark::after": { color: "var(--bq-warning-mark, peach)", },
        "&.cm-focused .bq-line.sw .bq-important-mark, .bq-important-mark::after": { color: "var(--bq-important-mark, rebeccapurple)", },
        "&.cm-focused .bq-line.sw .bq-caution-mark, .bq-caution-mark::after": { color: "var(--bq-caution-mark, red)", },
        
        "& .bq-text-line": { 
            lineHeight: "1lh",
            display: "inline-block",
            paddingLeft: "6px",
            textIndent: "-7px",
            ariaHidden: "true",
        },
        
        "& .bq-text-line *": {
            verticalAlign: "middle",
        },
        
        "& .wg-qt-icon": {
          display: "inline-block",
        },
        
        "& .wg-qt-icon > .qt-icon": {
          paddingLeft: "1ch",
          width: "2em",
          height: "2em"
        },
        
        "& .wg-qt-icon > .qt-tip": { fill: "var(--bq-tip-mark, green)" },
        "& .wg-qt-icon > .qt-note": { fill: "var(--bq-note-mark, blue)" },
        "& .wg-qt-icon > .qt-important": { fill: "var(--bq-important-mark, rebeccapurple)" },
        "& .wg-qt-icon > .qt-warning": { fill: "var(--bq-warning-mark, peach)" },
        "& .wg-qt-icon > .qt-caution": { fill: "var(--bq-caution-mark, red)" },
    });
};
