import { Decoration } from "@codemirror/view";
import { hasSelection, visibleNodes } from "../../common/usefull";

export function decorator(view, _) {

    const iterable = [ "Document" ]
    const types = {
        ATXHeading1: (from, show = true) => Decoration.line({class: "h1 hg " + (show ? "sw": "")}).range(from),
        ATXHeading2: (from, show = true) => Decoration.line({class: "h2 hg " + (show ? "sw": "")}).range(from),
        ATXHeading3: (from, show = true) => Decoration.line({class: "h3 hg " + (show ? "sw": "")}).range(from),
        ATXHeading4: (from, show = true) => Decoration.line({class: "h4 hg " + (show ? "sw": "")}).range(from),
        ATXHeading5: (from, show = true) => Decoration.line({class: "h5 hg " + (show ? "sw": "")}).range(from),
        ATXHeading6: (from, show = true) => Decoration.line({class: "h6 hg " + (show ? "sw": "")}).range(from),
    }

    const marks = {
        HeaderMark : (from, to) => Decoration.mark({ class: "mk" } ).range(from, to),
    }

    const widgets = []; 

    visibleNodes(view, { 
        enter: ({type, from, to}) => { 

            if ( type.name in types ) widgets.push(types[type.name](from, hasSelection(view, from, to)));
            if ( type.name in marks ) widgets.push(marks[type.name](from, to + 1));

            return iterable.includes(type.name) || (type.name in types); 
        }
    });
    
    return Decoration.set(widgets, false);
}