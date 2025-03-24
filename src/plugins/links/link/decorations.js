import {Decoration} from "@codemirror/view";
import { hasSelection, visibleNodes } from "../../common/usefull";

export function decorator(view, _) {
    
    const noIterable = [ "FencedCode" ]

    const urlTypes = {
        URL: (from, to, view) => Decoration.mark({ 
            class: "lk-url url", 
            tagName: "a", 
            attributes: {
                href: view.state.doc.sliceString(from, to),
                target: "_blank",
            } 
        }).range(from, to),
    };
    
    const stackble = { 
        Link: true,
        Blockquote: true,
    } 
    
    const wraper = { 
        Link: (from, to, selected) => Decoration.mark({ class: "link " + (selected ? "sw" : "") }).range(from, to) 
    }
    
    const marks = {
        LinkMark: (from, to) => Decoration.mark({ class: "lk-mk" }).range(from, to),
    }
    
    const widgets = []; 
    const stack = [];
    let url = "";
    let selected = false;
    
    visibleNodes(view, {
        enter: ({ type: { name }, from, to }) => { 
            if (name in wraper) { selected = hasSelection(view, from, to); }
            if (name in stackble) stack.push(name);
            return !(noIterable.includes(name)) 
        },
        leave: ({ type: { name }, from, to }) => {
            if (name in marks) widgets.push(marks[name](from, to))
            
            if (name in urlTypes) widgets.push(urlTypes[name](from, to, view));
            
            if (
                stack.slice(-1) in wraper &&
                name in urlTypes
            ) url = view.state.doc.sliceString(from, to)
            
            if (name in wraper) {
                const text = view.state.doc.sliceString(from, to);
                const tag = text.match(/\[(.*)\]/);
                const tagText = tag ? tag[1] : "";
                
                widgets.push(wraper[name](from, to, selected));
                if (url !== ""){
                    const start = text.indexOf(tagText);
                    widgets.push(textDec(from + start, from + 1 + tagText.length, url));
                }
                
                url = ""
                selected = false;
            }
            
            if (name in stackble) stack.pop();
        }
    });
    
    return Decoration.set(widgets, true);
}

const textDec = (from, to, url) => Decoration.mark({ 
    class: "lk-text url", 
    tagName: "a", 
    attributes: {
        href: url,
        target: "_blank",
    } 
}).range(from, to)