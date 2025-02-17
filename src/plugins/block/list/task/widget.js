import { WidgetType } from "@codemirror/view";

export class TaskMarker extends WidgetType {
    checked = false
    constructor(checked) {
        super();
        this.checked = checked;
    }

    // eq(other) { return other.checked == this.checked }

    toDOM() {
        let wrap = document.createElement("span")
        wrap.setAttribute("aria-hidden", "true")
        wrap.className = "TaskMark"
        
        let box = wrap.appendChild(document.createElement("input"))

        box.type = "checkbox"
        box.checked = this.checked

        return wrap
    }

    ignoreEvent() { return false }
}
