import { WidgetType } from "@codemirror/view";

export class HtmlWidget extends WidgetType {
  constructor(content, tag = false) {
    super();
    this.content = content;
    this.tag = tag;
  }

  toDOM() {
    const wrapper = document.createElement("div");
    wrapper.className = "cm-html-widget";
    wrapper.setAttribute("aria-hidden", "true");
    
    // Clean HTML content
    const cleanedContent = this.content
      .replace(/^```html\n?/, '')
      .replace(/```$/, '')
      .trim();
    
    wrapper.innerHTML = (this.tag ? '<span class="cm-rendered-tag">RTAG</span>' : '') + cleanedContent;
    
    // Deactivate scripts for security
    wrapper.querySelectorAll('script').forEach(script => {
      script.parentNode.removeChild(script);
    });
    
    return wrapper;
  }

  ignoreEvent(event) { return event.type === "click"; }
  
  eq(other) { return other.content === this.content; }
}