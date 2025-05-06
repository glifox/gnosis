import { WidgetType } from "@codemirror/view";
import { icons } from "./svgs";

export class Icon extends WidgetType {
    constructor(type) { super();
        this.type = type;
    }
    
    toDOM() { 
        let wrap = document.createElement("span")
        wrap.setAttribute("aria-hidden", "true")
        wrap.className = "wg-qt-icon";
        wrap.innerHTML = (this.type in icons) ? icons[this.type]() : "";
        
        return wrap;
    }

    ignoreEvent() { return false }

    eq(other) { return this.type === other.type }
}
