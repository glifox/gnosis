import { WidgetType } from "@codemirror/view";

export const header_class = "cm-codeblock-header";
export const lang_class = "cm-codeblock-lang";
export const path_class = "cm-codeblock-path";

export class CodeHeader extends WidgetType {
  private wrap = document.createElement("span");

  constructor(public lang: string, public path: string = "") {
    super();
    this.wrap.className = header_class;
    this.wrap.setAttribute("aria-hidden", "true");

    if (lang) {
      const langSpan = document.createElement("span");
      langSpan.className = lang_class;
      langSpan.textContent = lang;
      this.wrap.appendChild(langSpan);
    }

    if (path) {
      const pathSpan = document.createElement("span");
      pathSpan.className = path_class;
      pathSpan.textContent = path;
      this.wrap.appendChild(pathSpan);
    }
  }

  toDOM() {
    return this.wrap;
  }

  override eq(other: CodeHeader) {
    return other.lang === this.lang && other.path === this.path;
  }

  override ignoreEvent = () => false;
}
