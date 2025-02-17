import { Decoration } from "@codemirror/view";
import { hasSelection, visibleNodes } from "../../common/usefull";
import { TaskMarker } from "./task/widget";

export function decorator(view, _) {

    const iterable = [ 
        "Document",
        "ListItem",
        "Task",
    ]
    
    const types = {
        BulletList: "bl",
        OrderedList: "ol",
    }

    const marks = {
        ListMark: (from, to, type, show = true) => Decoration
            .mark({class: `${type} lm ${(show ? "sw": "")}`})
            .range(from, to),
        
        TaskMarker: (from, to, type, show = true) => {
            const check = view.state.doc.sliceString(from + 1, to - 1) === "x";
            
            if (show) return Decoration.mark({ class: `tm ${(check ? "ck": "")}`}).range(from, to);
            else return Decoration.replace({
                widget: new TaskMarker(check),
            }).range(from, to);
        }
    }

    const widgets = []; 
    const listStack = [];

    visibleNodes(view, { 
        enter: ({type, from, to}) => { 
            if (type.name in types) {
                listStack.push({name: type.name, from, to})
                return true;
            }

            if (type.name in marks) widgets.push(marks[type.name](
                from, to,
                types[listStack.slice(-1)[0].name],
                hasSelection(view, from, to)
            ))
            
            return iterable.includes(type.name); 
        },
        leave: ({ type: { name }, from, to}) => {
            const last = listStack.slice(-1)[0];

            if (
                last &&
                last.name === name &&
                last.from === from &&
                last.to   === to   
            ) listStack.pop();
        }
    });
    
    return Decoration.set(widgets, false);
}
