import { Decoration } from "@codemirror/view";
import { hasSelection, visibleNodes } from "../../common/usefull";

export function decorator(view, _) {
    const widgets = []; 

    console.log("loaded")
    
    return Decoration.set(widgets, false);
}