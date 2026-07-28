import { Decoration, WidgetType, type DecorationSet } from "@codemirror/view";
import type { Range } from "@codemirror/state";
import type { EditorView } from "codemirror";
import { hasSelection, visibleNodes } from "../../../utils";

export function decorator(view: EditorView, config: null): DecorationSet {
  const decorations: Range<Decoration>[] = [];

  const stack: string[] = [];
  visibleNodes(view, {
    enter: ({ name, from, to, node }) => {
      console.debug("| " + "| ".repeat(stack.length), name, node);
      stack.push(name)
    },
    leave({ name }) {
      if (stack[stack.length - 1] === name) stack.pop()
    }
  });

  return Decoration.set(decorations, false);
}

class Span extends WidgetType {
  constructor(public text: string) { super() }
  toDOM() {
    const span = document.createElement("span")
    span.style.color = 'transparent'
    span.style.backgroundColor = 'hsl(from red h s l / .1)'
    span.innerText = `${this.text}`
    
    return span
  }
  override get lineBreaks() { return 0 }
  override eq(other: Span) {
    return other.text === this.text
  }
}