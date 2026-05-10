import { Decoration, EditorView } from "@codemirror/view";
import type { Options } from "./plugin";
import type { Range } from "@codemirror/state";
import { decorationCodeblock } from "./decoration";
import { visibleNodes } from "../../../utils";


const iterable = [ "Document", "Blockquote", "ListItem", "BulletList", "OrderedList" ]

type Types = keyof typeof types;
const types = {
    FencedCode: decorationCodeblock,
    CodeBlock: decorationCodeblock,
}

type Marks = keyof typeof marks;
const marks = {
    CodeMark: (view: EditorView, from: number, to: number) => [Decoration.mark({ class: "cb-mk" }).range(from, to)],
    CodeInfo: (view: EditorView, from: number, to: number) => [Decoration.mark({ class: "cb-mi" }).range(from, to)],
}

type Config = { mode: 'mark' } | { mode: 'type', options: Options }

export function decorator(view: EditorView, conf: Config) {  
  const stack: any[] = [];

    const widgets: Range<Decoration>[] = [];

    visibleNodes(view, { 
        enter: ({type: { name }, from, to}) => { 
            
        if (conf.mode === "type" && name in types)
          widgets.push(...types[name as Types](view, from, to, stack, conf.options)) 
        if (conf.mode === "mark" && name in marks)
          widgets.push(...marks[name as Marks](view, from, to))
            
            if (iterable.includes(name) || (name in types)) {
                stack.push({ name, from, to }); return true;
            }
            
            return false; 
        },
        leave: ({type: {name}, from, to}) => {
            if (iterable.includes(name) || (name in types)) {
                stack.pop(); return true;
            }
            return false;
        }
    });
    
    return {
        type: Decoration.set(widgets, true),
        mark: Decoration.set(widgets, true),
    }[conf.mode];
}
