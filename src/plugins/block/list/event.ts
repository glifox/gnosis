import { syntaxTree } from "@codemirror/language";
import type { EditorView } from "codemirror";


export const mousedown = (e: MouseEvent, view: EditorView) => {
  let target = e.target as HTMLElement;
  
  if (
    target.nodeName === "INPUT" &&
    target.parentElement?.classList.contains("cm-taskmark")
  ) return toggleCheckbox(view, view.posAtDOM(target));
};

const toggleCheckbox = (view: EditorView, pos: number) => {
  const { from, to } = view.state.doc.lineAt(pos);
  
  let stop = false;
  let change = null;
  syntaxTree(view.state).iterate({
    from, to,
    enter({ name, from, to }) {
      if (name === 'TaskMarker') {
        const before = view.state.doc.sliceString(from, to)
        if (before === "[x]") change = { from, to, insert: "[ ]" }, stop = true
        if (before === "[ ]") change = { from, to, insert: "[x]" }, stop = true
        return false
      }
    },
  })
  
  if (change) view.dispatch({ changes: change })
  return stop
};
