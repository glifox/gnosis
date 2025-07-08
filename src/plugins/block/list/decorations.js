import { Decoration } from "@codemirror/view";
import { hasSelection, visibleNodes } from "../../common/usefull";
import { TaskMarker } from "./task/widget";

export function decorator(view, _) {

    const iterable = [ 
        "Document",
        "ListItem",
        "Task",
        "Blockquote"
    ]
    
    const types = {
        BulletList: {
            class: "bl",
            offset: 2
        },
        OrderedList: {
            class: "ol",
            offset: 3
        },
    }

    const marks = {
        ListMark: (from, to, type, show = true) => Decoration
            .mark({class: `${type.class} lm ${(show ? "sw": "")}`})
            .range(from, to),
        
        TaskMarker: (from, to, _, show = true) => {
            const check = view.state.doc.sliceString(from + 1, to - 1) === "x";
            
            if (show) return Decoration.mark({ class: `tm ${(check ? "ck": "")}`}).range(from, to);
            else return Decoration.replace({
                widget: new TaskMarker(check),
            }).range(from, to);
        },
    }
    
    const blocks = {
        ListItem: (from, to, type, isTask) => {
            // console.log({from, to, type, isTask})
            const offset = type.offset + (isTask ? 4 : 0);
            const start = from + offset;
            const width = `calc(100% - ${Math.max(0, offset) + 4}ch)`;
            if (start >= to) return [];
            return [
                Decoration.mark({
                    class: "ls-text-line",
                    attributes: { style: `width: ${width}` }
                }).range(start, to)
            ]
        }
    }
    
    const widgets = []; 
    const listStack = [];

    visibleNodes(view, { 
        enter: ({name, from, to, node}) => { 
            if (name in types) {
                listStack.push({name, from, to})
                return true;
            }
            
            if (name in marks) widgets.push(marks[name](
                from, to,
                types[listStack.slice(-1)[0].name],
                hasSelection(view, from, to)
            ))
            
            if (name in blocks) {
                console.log({node, name}); widgets.push(...blocks[name](
                    from, to,
                    types[listStack.slice(-1)[0].name],
                    node.getChild("Task") !== null
                ))
            }
            
            return iterable.includes(name); 
        },
        leave: ({ name, from, to}) => {
            const last = listStack.slice(-1)[0];

            if (
                last &&
                last.name === name &&
                last.from === from &&
                last.to   === to   
            ) listStack.pop();
        }
    });
    
    return Decoration.set(widgets, true);
}
