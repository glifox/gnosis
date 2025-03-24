export const mousedown = (e, _) => (e.ctrlKey) ? openLink(e.target /* as HTMLElement */) : false;

export const openLink = (target) => {
    if ( 
        target.nodeName === "A" && 
        target.href && 
        target.classList.contains("url") 
    ) {
        window.open(target.href, target.target);
        return true;
    }
}