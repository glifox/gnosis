import { WidgetType } from "@codemirror/view";

export class BrWraper extends WidgetType {
    classes = ""
    constructor(classes) {
        super();
        this.classes = classes;
    }

    toDOM() {
        let wrap = document.createElement("span")
        wrap.setAttribute("aria-hidden", "true")
        wrap.className = this.classes
        wrap.textContent = " "

        return wrap
    }

    ignoreEvent() { return false }
}
