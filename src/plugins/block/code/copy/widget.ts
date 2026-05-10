import { WidgetType } from "@codemirror/view";
import { icon } from "./icon";

export class CopyCode extends WidgetType {

  private wrap = document.createElement("span");
  private btn = document.createElement("button");
  
  constructor() {
    super();
    this.wrap.appendChild(this.btn);

    this.wrap.setAttribute("aria-hidden", "true");
    this.wrap.className = "wg-codeblock";

    this.btn.className = "wg-codeblock-btn";
    this.btn.innerHTML = icon(".7lh");
  }

  toDOM() {
    return this.wrap;
  }

  override ignoreEvent = () => false
}
