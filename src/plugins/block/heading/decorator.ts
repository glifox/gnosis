import { Decoration, WidgetType, type DecorationSet } from "@codemirror/view";
import type { Range } from "@codemirror/state";
import type { EditorView } from "codemirror";
import { hasSelection, visibleNodes } from "../../../utils";


const heading = (type: string) => Decoration.line({
  class: `cm-heading cm-heading${type}`
})

const skip = new Set([
  "CodeBlock",
  "FencedCode",
])

export function decorator(view: EditorView, config: null): DecorationSet {
  const decorations: Range<Decoration>[] = [];

  const stack: string[] = [];
  visibleNodes(view, {
    enter: ({ name, from, to, node }) => {
      if (skip.has(name)) return true;
      if (name.includes('Heading')) {
        // console.debug(name, node);
        const type = name.split('Heading').pop()
        if (type) decorations.push(heading(type).range(from))
        
      }
    }
  });

  return Decoration.set(decorations, false);
}
