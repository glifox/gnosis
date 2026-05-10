import { Decoration, EditorView, type DecorationSet } from "@codemirror/view";
import { Range } from "@codemirror/state";
import { hasSelection, PluginFactory, visibleNodes } from "../utils";


const types = new Set([
  "StrongEmphasis",
  "Strikethrough",
  "InlineCode",
  "Emphasis",
  
  "ATXHeading1",
  "ATXHeading2",
  "ATXHeading3",
  "ATXHeading4",
  "ATXHeading5",
  "ATXHeading6",
]);

const skip = new Set([
  "FencedCode",
  "CodeBlock",
])

const markDecoration = (isFirst: boolean, aditional: string = "") => Decoration.mark({ class: (isFirst) ? `mk ft ${aditional}` : `mk ${aditional}` })

const marks: {
  [key: string]: (
    from: number,
    to: number,
    isFirst: boolean
  ) => Range<Decoration>
} = {
  HeaderMark:
    (from, to, isFirst) =>
      markDecoration(isFirst).range(from, to + 1),
  EmphasisMark:
    (from, to, isFirst) =>
      markDecoration(isFirst).range(from, to),
  CodeMark:
    (from, to, isFirst) =>
      markDecoration(isFirst).range(from, to),
  StrikethroughMark:
    (from, to, isFirst) =>
      markDecoration(isFirst).range(from, to),
  // HorizontalRule: (from, to, isFirst) => markDecoration(isFirst).range(from, to),
}

const selected = (from: number, to: number) =>
  Decoration.mark({ class: "sel" }).range(from, to);

export const hideMarks = [
  PluginFactory((view): DecorationSet => {
    const decorations: Range<Decoration>[] = [];

    visibleNodes(view, {
      enter: ({ type: { name }, from, to }) => {
        if (skip.has(name)) return false;
        
        if (
          types.has(name) &&
          hasSelection(view, from, to)
        ) decorations.push(selected(from, to));

        if (name in marks) {
          const line = view.state.doc.lineAt(from);
          decorations.push(marks[name as keyof typeof marks]!(from, to, line.from == from || line.to == to))
        }
      },
    });

    return Decoration.set(decorations, false);
  }, null, {}),
  EditorView.baseTheme({
    ".mk.ft": { // trick to avoid jumps on hiden marks 
      "position": "absolute",
      "opacity": "0",
    },
    ".mk:not(.ft), &:not(.cm-focused) .mk.ft": {
      "display": "inline-block",
      "width": "1px",
      "height": "2px",
      "overflow": "hidden",
    },
    "&.cm-focused .sel > .mk, .mk:first-child:last-child": {
      "display": "inherit",
      "position": "relative",
      "fontSize": "inherit",
      "opacity": "1",
    },
  })
];
