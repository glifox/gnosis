import { WidgetType } from "@codemirror/view";

export class BrWraper extends WidgetType {
    classes = ""
    constructor(classes, width, marginLeft) { super();
        this.classes = classes;
        this.width = width;
        this.marginLeft = marginLeft;
    }

    toDOM() {
        let wrap = document.createElement("span")
        wrap.setAttribute("aria-hidden", "true")
        wrap.className = this.classes + " vacio";
        wrap.textContent = " "
        
        wrap.style.width = this.width;
        wrap.style.marginLeft = this.marginLeft;
        
        return wrap
    }

    ignoreEvent() { return false }
}
