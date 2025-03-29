import { Decoration } from "@codemirror/view";
import { hasSelection, visibleNodes } from "../../common/usefull";
import { syntaxTree } from "@codemirror/language";

export function decorator(view, _) {
    const iterable = [ "Document", "ListItem", "BulletList", "OrderedList" ]
    const quoteTypes = {
        "none":      "bq-none-mark",
        "note":      "bq-note-mark",
        "tip":       "bq-tip-mark",
        "warning":   "bq-warning-mark",
        "important": "bq-important-mark",
        "caution":   "bq-caution-mark",
    }

    const types = {
        Blockquote: () => { }
    }
    
    const marks = {
        QuoteMark: (from, to, type) => {
            const class_ = ["qt-mk"];
            if (type in quoteTypes) class_.push(quoteTypes[type]);
            
            return Decoration.mark({
                class: class_.join(" ")
            }).range(from, to)
        },
        BlockquoteLine: (from, selected) => Decoration.line({ class: "bq-line " + (selected ? "sw": "") }).range(from)
    }
    
    const getDecorations = (view, node, startLine, lines) => {
        const decorations = [];
        const { from, to } = node;
        const begin = startLine.number;
        
        const iterator = () => {
            let marksCount = 0;
            const stack = [];
            
            return {
                enter({ name, node, from, to }) {
                    if (name === "Blockquote") stack.push(getQuoteType(view, node));
                    
                    if (name === "QuoteMark") {
                        decorations.push(marks[name](from, to, stack[marksCount]));
                        marksCount++;
                    }
                }
            }
        }
        
        for ( let index = begin; index < lines + begin; index++) {
            const { from, to } = view.state.doc.line(index);
            const { from: s, to: e } = node;
            const selected = hasSelection(view, s, e);
            decorations.push(marks.BlockquoteLine(from, selected));
            
            syntaxTree(view.state).iterate({ from, to, ... iterator() })
        }
        
        
        return decorations
    }

    const widgets = [];
    
    visibleNodes(view, { 
        enter: ({ name }) => !(name in iterable),
        leave: ({ name, from, to, node}) => { 
            if (name !== "Blockquote") return;
            
            const lines = view.state.sliceDoc(from, to).split("\n");
            const startLine = view.state.doc.lineAt(from);
            
            widgets.push(... getDecorations(view, node, startLine, lines.length))
        },
    });
    
    return Decoration.set(widgets, true)
}

const getQuoteType = (view, node) => {
    const node_ = node.getChild("QuoteTypeText");
    if (!node_) return "none";
    return view.state.sliceDoc(node_.from, node_.to).toLowerCase();
}