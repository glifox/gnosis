import type { Range } from "@codemirror/state";
import { Decoration, WidgetType, type DecorationSet } from "@codemirror/view";
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
} as const;


class TaskInput extends WidgetType {
  constructor(public checked: boolean) { super() }
  toDOM() {
    const span = document.createElement("span")
    const checkbox = document.createElement('input')
    const text = document.createTextNode(this.checked ? '[x]' : '[ ]')
    
    checkbox.type = "checkbox"
    checkbox.checked = this.checked
    checkbox.style.margin = '0'
    checkbox.style.position = 'absolute'
    checkbox.style.top = '50%'
    checkbox.style.left = '50%'
    checkbox.style.transform = 'translate(-50%, -50%)'
    
    span.style.position = 'relative'
    span.style.color = 'transparent'
    span.classList.add('cm-taskmark')
    span.append(checkbox, text)
    return span
  }
  override get lineBreaks() { return 0 }
  override eq(other: TaskInput) {
    return other.checked === this.checked
  }
  override ignoreEvent(event: Event): boolean { return false }
}

const marks = {
  ListMark: ({ type, from, to, show }: MarkData) => [
    Decoration
    .mark({
      class: `cm-listmark cm-${type} ${(show) ? 'mk-show' : ''}`,
    })
      .range(from, to)
  ],
  TaskMarker: ({ from, to, show, text }: MarkData) => (show)
    ? []
    : [
      Decoration
        .replace({ widget: new TaskInput(text === '[x]') })
        .range(from, to)
    ]
}


type ListType = keyof typeof ListTypes;
type MarkData = { type: typeof ListTypes[ListType]['type'] , from: number, to: number, show: boolean, text: string }

export const decorator: (view: EditorView, config: {}) => DecorationSet = (view) => {
  const decorations: Range<Decoration>[] = [];

  const stack: ListType[] = []
  visibleNodes(view, {
    enter({ name, from, to }) {
      if (name in ListTypes) stack.push(name as ListType)
      
      if (name in marks) decorations.push(
        ...marks[name as keyof typeof marks]({
          from, to, type: ListTypes[stack[stack.length - 1]!].type,
          show: hasSelection(view, from, to),
          text: view.state.doc.sliceString(from, to),
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

