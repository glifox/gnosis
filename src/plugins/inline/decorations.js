import {Decoration} from "@codemirror/view";
import { hasSelection, visibleNodes } from "../common/usefull";

export function decorator(view, _) {
    
    const noIterable = [ "FencedCode" ]

    const types = {
        'StrongEmphasis': (show = true, from, to) => Decoration.mark({class: "il st " + (show ? "sw": "")}).range(from, to),
        'Strikethrough':  (show = true, from, to) => Decoration.mark({class: "il sk " + (show ? "sw": "")}).range(from, to),
        'InlineCode':     (show = true, from, to) => Decoration.mark({class: "il ic " + (show ? "sw": "")}).range(from, to),
        'Emphasis':       (show = true, from, to) => Decoration.mark({class: "il it " + (show ? "sw": "")}).range(from, to),
        'Mark':           (from, to) => Decoration.mark({ class: "mkl" }).range(from, to),
    };
    
    const marks = [ "EmphasisMark", "CodeMark", "StrikethroughMark" ]

    const widgets = []; 

    visibleNodes(view, {
        enter: ({type: { name }, from: start, to: end}) => {
            
            if (marks.includes(name)) {
                widgets.push(types["Mark"](start, end));
                return false;
            }

            if (name in types) widgets.push(
                types[name](
                    hasSelection(view, start, end), 
                    start, 
                    end
                )
            )

            return !(noIterable.includes(name))
        }
    });
    
    return Decoration.set(widgets, false);
}

