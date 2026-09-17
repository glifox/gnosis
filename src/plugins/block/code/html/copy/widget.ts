import { WidgetType } from "@codemirror/view";
import { icon } from "./icon";

export const wrap_class = "cm-widget-copy-codeblock"
export const boton_class = "cm-widget-copy-codeblock-btn"

export class CopyCode extends WidgetType {

  private wrap = document.createElement("span");
  private btn = document.createElement("button");
  
  constructor() {
    super();
    this.wrap.appendChild(this.btn);

    this.wrap.setAttribute("aria-hidden", "true");
    this.wrap.className = wrap_class;

    this.btn.className = boton_class;
    this.btn.innerHTML = icon(".7lh");
  }

  toDOM() {
    return this.wrap;
  }

  override ignoreEvent = () => false
}
