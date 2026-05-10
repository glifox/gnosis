import { WidgetType } from "@codemirror/view";
import { icon } from "./icon";

export class CopyCode extends WidgetType {
  constructor(
    private type: string,
    private code: string,
  ) {
    super();
  }

  toDOM() {
    let wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    wrap.className = "wg-codeblock";

    let btn = document.createElement("button");
    btn.className = "wg-codeblock-btn";
    btn.innerHTML = icon(".7lh");

    wrap.appendChild(btn);

    return wrap;
  }

  override ignoreEvent = () => false
}
