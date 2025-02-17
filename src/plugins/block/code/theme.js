import { EditorView } from "codemirror"

export const codeTheme = EditorView.baseTheme({
    ".cb-content": { backgroundColor: "#e1e4ea"}
})

export const coreTheme = () => {
    const marginLeft = 2;
    const paddingLeft = 6;
    const paddingRigth = 2;
    const width = "100%";

    return EditorView.baseTheme({
        ".cb-start": { borderRadius: "1ch 1ch 0 0" },
        ".cb-end  ": { borderRadius: "0 0 1ch 1ch" },
        ".cb-start.cb-end": { borderRadius: "1ch" },

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
