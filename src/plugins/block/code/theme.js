import { EditorView } from "codemirror";

export const coreTheme = () => {
    const marginLeft = 2;
    const paddingLeft = 6;
    const paddingRigth = 0;
    const borderRadius = "4px";
    const width = "100%";

    return EditorView.baseTheme({
        ".cb-content": { 
            display: "inline-block",
            marginLeft: `${marginLeft}px`, 
            paddingLeft: `${paddingLeft}px`, 
            paddingRigth: `${paddingRigth}px` ,
            position: "relative"
        },
        
        ".cb-content.wg": { cursor: "text" },
        ".cb-content.wg.start": { 
            maxWidth: "1px",
            Width: "1px",
            paddingLeft: `${paddingLeft-1}px`,
        },
        
        ".cb-content.wg.end": {
            marginLeft: "0", 
            paddingLeft: "0"
        },
        
        ".cb-mi, .cb-mk": { color: "transparent" },
        "&.cm-focused .cb-content.sw > .cb-mi, &.cm-focused .cb-content.sw > .cb-mk": { color: "inherit" },
        
        "&.cm-focused .cb-content.sw .wg-codeblock": { 
            display: "none",
            opacity: "0" 
        },
        ".wg-codeblock": {
            display: "inline-block",
            position: "absolute",
            top: "0",
            right: "0",
            zIndex: "100",
            padding: "4px"
        }
    })
}
