export const getTextFromLink = (view, from, to) => {
    const link = view.state.sliceDoc(from, to);
    const title = link.match(/\[(.*)\]/);
    if (
        title !== null &&
        title.length > 1
    ) {
        return { 
            text: title[1], 
            from: from + link.indexOf(title[1]), 
            to: from + 1 + title[1].length 
        };
    }
    return { text: null };
}