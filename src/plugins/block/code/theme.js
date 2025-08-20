import { EditorView } from "codemirror";

/**
 * 
 * @param {object} options 
 * @param {number} options.marginLeft - The left margin for the content.
 * @param {number} options.paddingLeft - The left padding for the content.
 * @returns 
 */
export const coreTheme = (options) => {
    const marginLeft = options.marginLeft;
    const paddingLeft = options.paddingLeft;
    const paddingRigth = 0;
    const borderRadius = "4px";
    
    // button
    const buttonSize = "1lh";
    const buttonMargin = ".05lh";

    return EditorView.baseTheme({
        "& .cb-start": { borderRadius: `${borderRadius} ${borderRadius} 0 0` },
        "& .cb-end  ": { borderRadius: `0 0 ${borderRadius} ${borderRadius}` },
        "& .cb-start.cb-end": { borderRadius: `${borderRadius}` },
        
        "& .cm-line .cb-content": { 
            display: "inline-block",
            marginLeft: `${marginLeft}px`, 
            paddingLeft: `${paddingLeft}px`, 
            paddingRigth: `${paddingRigth}px` ,
            position: "relative",
        },
        
        "& .cb-content.wg": { cursor: "text" },
        "& .cb-content.wg.start": { 
            maxWidth: "1px",
            Width: "1px",
            paddingLeft: `${paddingLeft-1}px`,
        },
        
        "& .cb-content.wg.end": {
            marginLeft: "0", 
            paddingLeft: "0"
        },
        
        "& .cb-mi,& .cb-mk": { color: "transparent" },
        "&.cm-focused .cb-content.sw > .cb-mi, &.cm-focused .cb-content.sw > .cb-mk": { color: "inherit" },
        
        "&.cm-focused .cb-content.sw .wg-codeblock": { 
            display: "none",
            opacity: "0" 
        },
        
        "& .wg-codeblock": {
            display: "inline-block",
            position: "absolute",
            top: "0",
            right: "0",
            zIndex: "100",
            margin: buttonMargin,
        },
        
        "& .wg-codeblock-btn": {
            padding: "0",
            display: "inline-flex",
            borderRadius: "999999px",
            background: "transparent",
            border: "none",
            outline: "none",
            justifyContent: "center",
            alignItems: "center",
            height: `calc(${buttonSize} + 4px )`,
            width: "5ch",
        },
        
        "& .cb-icon": {
            width: buttonSize,
            height: buttonSize,
            pointerEvents: "none",
            fill: "currentColor",
            opacity: "0.7"
        },
        
        "& .wg-codeblock-btn:hover": { background: "rgba(0, 0, 0, 0.07)", },
        "& .wg-codeblock-btn:hover .cb-icon": { opacity: "1" },
        
        "& .cb-content.cb-start.cb-end  .wg-codeblock": {
            marginTop: "0",
            marginBottom: "0",
            top: "0",
            bottom: "0",
        },
        "& .cb-content.cb-start.cb-end  .wg-codeblock-btn":{
            boxSizing: "border-box",
            maxHeight: "100%",
            width: "5ch",
        },
        
        "& .cb-content": {
            backgroundColor: "var(--cm-ic-background, hsl(from black h s l / .1))"
        },
        
        "& .cb-error.left":{ padding: "0" },
        "& .cb-error.right":{ paddingRight: `${marginLeft}px` },
        "& .cb-error":{
          display: "inline-block",
          backgroundColor: "var(--cm-ic-error, hsl(from red h s l / .5))",
        },
    })
}
