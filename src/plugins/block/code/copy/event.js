export const mousedown = (e, view) => {
    let target = e.target /* as HTMLElement */
    
    if (
        target.nodeName === "BUTTON" &&
        target.parentElement?.classList.contains("wg-codeblock")
    ) {
        
        console.log("copy code: ", e);
        console.log(view.posAtDOM(target)); 
        
        return true;
    }

}