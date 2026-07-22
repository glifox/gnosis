import type { Range } from "@codemirror/state";
import { Decoration, type DecorationSet } from "@codemirror/view";
import type { EditorView } from "codemirror";
import { hasSelection, visibleNodes } from "../../../utils";


const ITERABLE = [
  "Document",
  "ListItem",
  "Task",
  "Blockquote",
  "BulletList",
  "OrderedList",
];

const ListTypes = {
  BulletList: {
    type: 'pointmark'
  },
  OrderedList: {
    type: 'numbermark'
  },
};

const marks = {
  ListMark: ({ type, from, to, show }: { type: typeof ListTypes[ListType]['type'] , from: number, to: number, show: boolean }) => Decoration
    .mark({
      class: `cm-listmark cm-${type} ${(show) ? 'mk-show' : ''}`,
    })
    .range(from, to)
}


type ListType = keyof typeof ListTypes;

export const decorator: (view: EditorView, config: {}) => DecorationSet = (view) => {
  const decorations: Range<Decoration>[] = [];

  const stack: ListType[] = []
  visibleNodes(view, {
    enter({ name, from, to }) {
      if (name in ListTypes) stack.push(name as ListType)
      
      if (name in marks) decorations.push(
        marks[name as keyof typeof marks]({
          from, to, type: ListTypes[stack[stack.length - 1]!].type,
          show: hasSelection(view, from, to)
        })
      )
      
      return ITERABLE.includes(name); 
    },
    leave({ name }) {
      if (stack[stack.length -1] === name) stack.pop()
    }
  })
  
  
  
  return Decoration.set(decorations, false)
}

