import { Decoration, type DecorationSet } from "@codemirror/view";
import type { Range } from "@codemirror/state";
import type { EditorView } from "codemirror";
import { visibleNodes } from "../../utils";

export function decorator(view: EditorView, config: null): DecorationSet {
  const decorations: Range<Decoration>[] = [];

  const stack: string[] = [];
  visibleNodes(view, {
    enter: ({ name, from, to, node }) => {
      console.info("" + " ".repeat(stack.length), name);
      stack.push(name)
    },
    leave({ name }) {
      if (stack[stack.length - 1] === name) stack.pop()
    }
  });

  return Decoration.set(decorations, false);
}
