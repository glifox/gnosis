import { Decoration } from "@codemirror/view";
import { hasSelection, visibleNodes } from "../../common/usefull";
import { ImageWidget } from "./widget";
import { getTextFromLink } from "../common/text";

export function decorator(view, _) {
    
    const noIterable = [ "FencedCode", "Image" ]

    const widgets = []; 

    visibleNodes(view, {
        enter: ({type: { name }, from, to, node}) => {
            if (name === "Image" && !hasSelection(view, from, to)) {
                const {from: start, to: end} = node.getChild("URL");
                const url = view.state.sliceDoc(start, end);
                
                const { text } = getTextFromLink(view, from, to);
                
                widgets.push(
                    Decoration.replace({
                        widget: new ImageWidget(url, getParentURL(view, node), text),
                    }).range(from, to)
                );
            }
            
            return !(noIterable.includes(name))
        }
    });
    
    return Decoration.set(widgets, false);
}

const getParentURL = (view, node) => {
    const parent = node.parent;
    const node_ = parent.getChild("URL");
    
    if (node_ !== null) {
        const {from, to} = node_;
        return view.state.sliceDoc(from, to);
    }
    
    return null;
}
