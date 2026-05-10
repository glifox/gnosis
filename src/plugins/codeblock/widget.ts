import { WidgetType } from "@codemirror/view";

export class BrWraper extends WidgetType {

  constructor(
    private classes: string,
    private width: string,
    private marginLeft: string = '',
    private spaces = 1
  ) { super(); }

  toDOM() {
    let wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    wrap.className = this.classes + " empty";
    wrap.textContent = " ".repeat(this.spaces);

    wrap.style.width = this.width;
    wrap.style.marginLeft = this.marginLeft;

    return wrap;
  }

  override ignoreEvent = () => false
}
