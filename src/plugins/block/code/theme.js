import { EditorView } from "codemirror"

export const codeTheme = EditorView.baseTheme({
    "&": { backgroundColor: "rgb(239, 241, 245)" },
    "& .cb-content": { backgroundColor: "rgba(149, 161, 185, .1)" },
})

export const coreTheme = () => {
    const marginLeft = 2;
    const paddingLeft = 6;
    const paddingRigth = 2;
    const borderRadius = "4px";
    const width = "100%";

    return EditorView.baseTheme({
        ".cb-start": { borderRadius: `${borderRadius} ${borderRadius} 0 0` },
        ".cb-end  ": { borderRadius: `0 0 ${borderRadius} ${borderRadius}` },
        ".cb-start.cb-end": { borderRadius: `${borderRadius}` },

        ".cb-line": { display: "flex !important", },

        ".cb-content": { 
            display: "inline-block",
            zIndex: "-1",
            flex: "1",
            marginLeft: `${marginLeft}px`, 
            paddingLeft: `${paddingLeft}px`, 
            paddingRigth: `${paddingRigth}px` 
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
        ".cb-content.sw > .cb-mi, .cb-content.sw > .cb-mk": { color: "inherit" },
    })
}
