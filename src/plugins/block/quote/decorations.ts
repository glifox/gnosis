import { Decoration, type DecorationSet } from "@codemirror/view";
import type { Range } from "@codemirror/state";
import type { EditorView } from "codemirror";
import { visibleNodes, hasSelection } from "../../../utils";
import { icons } from "./widget";


const ITERABLE = [
  "Document", "ListItem",
  "BulletList", "OrderedList",
  "Blockquote", "QuoteKind",
];

const quoteTypes = {
  none: "quote-none-mark",
  "[!note]": "quote-note-mark",
  "[!tip]": "quote-tip-mark",
  "[!warning]": "quote-warning-mark",
  "[!important]": "quote-important-mark",
  "[!caution]": "quote-caution-mark",
} as const;

type QuoteKind = keyof typeof quoteTypes;
type Blockquote = {
  type: QuoteKind;
}
type DecorationData = {
  type: QuoteKind,
  from: number,
  to: number,
  selected: boolean,
}

const decorationMarks = {
  QuoteMark: ({ type, from, to, selected }: DecorationData & {  }) => [
    Decoration.mark({
      class: `quote-mark ${quoteTypes[type]} ${(selected ? 'selected' : '')}`,
      // attributes: { style: 'background-color: red;' }
    }).range(from, to)
  ],
  QuoteKindMarker: ({ type, from, to, selected }: DecorationData) => (type === 'none')
    ? []
    : [
      Decoration.widget({
        widget: icons[type],
        side: 1,
      }).range(from),
      Decoration.mark({
        class: `quote-kind-marker start ${(selected ? 'selected' : '')} ${quoteTypes[type]}`,
        attributes: { style: 'margin-left: 4px;' }
      }).range(from, from + 2),
      Decoration.mark({
        class: `quote-kind-text ${quoteTypes[type]}`,
      }).range(from +2, to -1),
      Decoration.mark({
        class: `quote-kind-marker end ${(selected ? 'selected' : '')} ${quoteTypes[type]}`,
        // attributes: { style: 'background-color: blue;' }
      }).range(to -1, to),
    ]
}

export function decorator(view: EditorView, config: null): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  
  const stack: Blockquote[] = [];
  visibleNodes(view, {
    enter: ({ name, from, to, node }) => {
      if ('Blockquote' === name) {
        const quoteKind = node.getChild('QuoteKind')?.firstChild
        const type: QuoteKind = (quoteKind) ? view.state.sliceDoc(quoteKind.from, quoteKind.to).toLocaleLowerCase() as QuoteKind : 'none'
        stack.push({ type })
        // console.info(" ∣ ".repeat(stack.length), quoteTypes[stack[stack.length -1]!.type]);
      }
      
      if (name in decorationMarks) {
        const line = view.state.doc.lineAt(from);
        const textBefore = line.text.slice(0, to - line.from);
        const current = textBefore.match(/>\s*/ig)!.length;
        const matches = line.text.match(/>\s*/ig)!.length;
        
        // console.info("matches, stack.length, current, stack[stack.length -1]:", matches, stack.length, current, stack[stack.length - 1]);
        
        let type_index = stack.length - 1;
        if (matches > current && matches >= stack.length) type_index = current - 1;
        else
        if (matches > current && matches < stack.length) type_index = current;
        
        decorations.push(
          ...decorationMarks[name as keyof typeof decorationMarks]({
            from, to,
            type: stack[type_index]?.type ?? 'none',
            selected: hasSelection(view, from, to),
          })
        )
      }
      
      // return ITERABLE.includes(name);
    },
    leave({ name }) {
      if ('Blockquote' === name) stack.pop()
    }
  });

  return Decoration.set(decorations, false);
}
