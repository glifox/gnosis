import {Decoration} from "@codemirror/view";
import { hasSelection, visibleNodes } from "../../common/usefull";

export function decorator(view, _) {
    
    const noIterable = [ "FencedCode", "Image", "Link" ]
    
    const types = {
        Link: {
            marks: ["LinkMark"],
            url: "URL",
        }
    }
    const decorations = {
        Link: (from, to, selected) => Decoration.mark({ class: "link " + (selected ? "sw" : "") }).range(from, to),
        LinkMark: (from, to) => Decoration.mark({ class: "lk-mk" }).range(from, to),
        TextDec: (from, to, url) => Decoration.mark({ 
            class: "lk-text url", tagName: "a", 
            attributes: { href: url, target: "_blank" } 
        }).range(from, to),
        URL: (from, to, url) => Decoration.mark({ 
            class: "lk-url url", tagName: "a", 
            attributes: { href: url, target: "_blank" } 
        }).range(from, to),
    };
    
    const widgets = []; 
    visibleNodes(view, {
        enter: ({ type: { name }, from, to, node }) => { 
            
            if (name in types) {
                widgets.push(decorations.Link(from, to, hasSelection(view, from, to)));
                
                const marks = types[name].marks.flatMap(mark => node.getChildren(mark));
                widgets.push(...marks.map(({ from, to }) => decorations.LinkMark(from, to)));
                
                const url = node.getChild(types[name].url);
                
                if ( url !== null ) {
                    const { from: start, to: end } = url;
                    widgets.push(decorations.URL(start, end, view.state.sliceDoc(start, end)))
                }
            }
            
            return !(noIterable.includes(name)) 
        },
    });
    
    return Decoration.set(widgets, true);
}
