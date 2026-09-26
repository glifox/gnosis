import { hasSelection, PluginFactory, visibleNodes } from "../utils";
import { type DecorationSet, Decoration, EditorView } from "@codemirror/view";
import type { Range } from "@codemirror/state";


const skip = new Set([
  "FencedCode",
  "CodeBlock",
])

type Inline = {
  from: number,
  to: number,
  selected: boolean,
};

const inline_code_class = "cm-inline-code";
const selected_class = "cm-inline-selected";
const isselected = (selected: boolean) => selected ? ' ' + selected_class : '';

const markins: Record<string, (v: Inline) => Range<Decoration>> = {
  InlineCode: ({ from, to, selected }: Inline) => {
    return Decoration.mark({ class: inline_code_class + isselected(selected) }).range(from, to)
  }
};

function decorator(view: EditorView, config: null): DecorationSet {
  const decorations: Range<Decoration>[] = [];

  const stack: string[] = [];
  visibleNodes(view, {
    enter: ({ name, from, to, node }) => {
      if (skip.has(name)) return false;
      if (name in markins) decorations.push(
        markins[name]!({ from, to, selected: hasSelection(view, from, to) })
      )
      console.debug("| " + "| ".repeat(stack.length), name, node);
      stack.push(name)
    },
    leave({ name }) {
      if (stack[stack.length - 1] === name) stack.pop()
    }
  });

  return Decoration.set(decorations, false);
}

export const inline = [
  PluginFactory(decorator, null),
  EditorView.baseTheme({
    [`.${inline_code_class}`]: {
      position: "relative",
      fontFamily: "monospace",
    },
    [`.${inline_code_class}::before`]: {
      content: "\"\"",
      position: "absolute",
      width: "100%",
      height: "100%",
      top: "0",
      
      backgroundColor: "var(--cm-inline-code-bg, hsl(from gray h s l / .1))",
      borderRadius: "4px",
      zIndex: "-80",
    },
  })
]
