import { syntaxTree } from "@codemirror/language";

export const hasSelection = (view, from, to) => {
    const selections = view.state.selection.ranges;
    
    for (let range of selections) {
        if ((range.from >= from && range.from <= to) ||
            (range.to >= from && range.to <= to) ||
            (range.from <= from && range.to >= to)) {
            return true;
        }
    }
    
    return false;
}

export const visibleNodes = ( view, iterator ) => {
    for (const { from, to } of view.visibleRanges) 
        syntaxTree(view.state).iterate({ ...iterator, from, to });
}