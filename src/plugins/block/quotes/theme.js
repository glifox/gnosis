import { EditorView } from "codemirror";

export const coreTheme = () => {
    const width = "2px";
    return EditorView.baseTheme({
        ".qt-mk": {
            // outline: "1px red solid",
            position: "relative",
        },
        ".qt-mk::after": {
            position: "absolute",
            content: '" "', // Las comillas dobles dentro de la cadena son necesarias
            backgroundColor: "currentColor",
            top: "-1lh",
            left: `-${width}`,
            width: width,
            height: "100vh",
            zIndex: "-1",
        },
        "& .cm-line": {
            overflowY: "hidden !important",
        }
    });
};
