import { Decoration } from "@codemirror/view";
import { hasSelection, visibleNodes } from "../../common/usefull";

export function decorator(view, _) {

    const iterable = [ "Document" ]
    const types = { }

    const marks = {
        HorizontalRule: (from, to, show = true) => [
            Decoration.line({class: "hr " + (show ? "sw": "")}).range(from),
            Decoration.mark({class: "mk"}).range(from, to)
        ]
    }

    const widgets = []; 

    visibleNodes(view, { 
        enter: ({type, from, to}) => { 

            if (type.name in marks) 
                widgets.push(...marks[type.name](from, to, hasSelection(view, from, to)));
            
            return iterable.includes(type.name) || (type.name in types); 
        }
    });
    
    return Decoration.set(widgets, false);
}