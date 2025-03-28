import { Decoration } from "@codemirror/view";
import { hasSelection, visibleNodes } from "../../common/usefull";

const stack = [];

export function decorator(view, _) {


    const iterable = [ "Document", "Blockquote", "ListItem", "BulletList", "OrderedList" ]
    

    const types = {
        Blockquote: () => { }
    }
    
    const marks = {
        QuoteMark: (from, to) => Decoration.mark({class: "qt-mk", attributes: { style: "color: red;" }}).range(from, to),
        LinkMark: (from, to) => Decoration.mark({class: "qt-mk", attributes: { style: "color: blue;" }}).range(from, to),
        Link:     (from, to) => Decoration.mark({class: "qt-mk", attributes: { style: "color: green;" }}).range(from, to),
    }

    const widgets = [];

    visibleNodes(view, { 
        enter: ({type: {name}, from, to}) => { 
            
            // if (name in marks) widgets.push(marks[name](from, to));
            // if (name === "QuoteTipe") console.log("enter", name, from, to);
            console.log("enter", name, from, to);
            
            // return false; 
        }
    });
    
    return Decoration.set(widgets, true)
}
