import { WidgetType } from "@codemirror/view";

export class BrWraper extends WidgetType {
    classes = ""
    constructor(classes, width, marginLeft, spaces = 1) { super();
        this.classes = classes;
        this.width = width;
        this.marginLeft = marginLeft;
        this.spaces = spaces;
    }

    toDOM() {
        let wrap = document.createElement("span")
        wrap.setAttribute("aria-hidden", "true")
        wrap.className = this.classes + " empty";
        wrap.textContent = " ".repeat(this.spaces);
        
        wrap.style.width = this.width;
        wrap.style.marginLeft = this.marginLeft;
        
        return wrap
    }

    ignoreEvent() { return false }
}
