import { Decoration } from "@codemirror/view";
import { hasSelection, visibleNodes } from "../../common/usefull";
import { BrWraper } from "./widget";
import { LeafBlock } from "@lezer/markdown";

const stack = [];

export function decorator(view, conf) {

    const {
        mode, /* type, mark */
    } = conf;

    const iterable = [ "Document", "Blockquote", "ListItem", "BulletList", "OrderedList" ]
    const types = {
        FencedCode: decorationCodeblock,
        CodeBlock: decorationCodeblock,
    }

    const marks = {
        CodeMark: (from, to) => Decoration.mark({ class: "cb-mk" }).range(from, to),
        CodeInfo: (from, to) => Decoration.mark({ class: "cb-mi" }).range(from, to)
    }

    const widgets = [];

    visibleNodes(view, { 
        enter: ({type: {name}, from, to}) => { 
            
            if (mode === "type" && name in types) widgets.push(... types[name](view, from, to)) 
            if (mode === "mark" && name in marks) widgets.push(marks[name](from, to))
            
            if (iterable.includes(name) || (name in types)) {
                stack.push({ name, from, to });
                return true;
            }
            
            return false; 
        },
        Leave: ({type: {name}, from, to}) => {
            if (iterable.includes(name) || (name in types)) {
                stack.pop();
                return true;
            }
            return false;
        }
    });
    
    return {
        type: Decoration.set(widgets, true),
        mark: Decoration.set(widgets, true),
    }[mode];
}

const decorationCodeblock = (view, from, to) => {
    const decorations = [];
    const father = stack[stack.length - 1];
    const isSpaced = ["BulletList", "OrderedList", "ListItem"].some(s => s === father.name);
    const isQuoted = ["Blockquote"].some(s => s === father.name);
    
    const startLine = view.state.doc.lineAt(from);
    const offset = from - startLine.from;

    const selected = hasSelection(view, startLine.from, to);
    
    const begin = startLine.number;
    const lines = view.state.doc
        .sliceString(from, to).split('\n').length;
    
    for ( let i = begin; i < lines + begin; i++) {
        const class_ = ["cb-content"];
        
        if (selected) class_.push("sw");
        if ( i === begin  ) class_.push("cb-start")
        if ( i === lines + begin - 1 ) class_.push("cb-end");
        
        const { from, to } = view.state.doc.line(i)

        const start = Math.max(from + offset, 0);

        if ( start === to ) {
            class_.push("wg");

            decorations.push(Decoration.widget({ widget: new BrWraper(class_.join(" ") + " start"), side: 0 }).range(start))   
            decorations.push(Decoration.widget({ widget: new BrWraper(class_.join(" ") + " end"), side: 1 }).range(start))

        } 
        else if (isSpaced || isQuoted) {
            if (to > start) decorations.push(Decoration.mark({ class: class_.join(" ") }).range(start, to))
            
            if (from !== start && isSpaced) decorations.push(Decoration.mark({ class: "cb-spacer" }).range(from, start))
            if (from !== start && isQuoted) decorations.push(Decoration.mark({ class: "cb-quote bq" }).range(from, start))
        }
        else if ( from !== to ) decorations.push(Decoration.mark({ class: class_.join(" ") }).range(from, to))
        
        decorations.push(Decoration.line({ class: "cb-line" }).range(from))
    }

    return decorations
}
