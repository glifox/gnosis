import { WidgetType } from "@codemirror/view";

export class CopyCode extends WidgetType {
    constructor(type, code) { super();
        this.type = type;
        this.code = code;
    }

    toDOM() {        
        let wrap = document.createElement("span")
        wrap.setAttribute("aria-hidden", "true")
        wrap.className = "wg-codeblock";
        
        let btn = document.createElement("button");
        btn.className = "wg-codeblock-btn";
        btn.textContent = "Copy";
        
        wrap.appendChild(btn);
        
        return wrap;
    }

    ignoreEvent() { return false }
}
