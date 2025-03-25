export const mousedown = (e, _) => (e.ctrlKey) ? openLink(e.target /* as HTMLElement */) : false;

export const openLink = (target) => {
    const parent = target.parentElement ?? false;
    if ( 
        target.nodeName === "IMG" &&
        parent && 
        parent.nodeName === "A" &&
        parent.classList.contains("url")
    ) { return true }
}