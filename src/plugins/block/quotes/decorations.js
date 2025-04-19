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
            else class_.push(quoteTypes["none"]);
            
            return Decoration.mark({
                class: class_.join(" ")
            }).range(from, to)
        },
        BlockquoteLine: (from, selected) => Decoration.line({ class: "bq-line " + (selected ? "sw": "") }).range(from),
        quoteLine: (from, to, offset) => {
            const width = `calc(100% - ${Math.max(0, offset) + 1.2}ch)`;
            return Decoration.mark({
                class: "bq-text-line",
                attributes: { style: `width: ${width}` }
            }).range(from, to)
        }
    }
    
    const getDecorations = (view, node, startLine, lines) => {
        const decorations = [];
        const { from, to } = node;
        const begin = startLine.number;
        
        const iterator = (start, end) => {
            let marksCount = 0;
            const stack = [];
            let marksEnd = 0;
            
            return {
                enter({ name, node, from, to }) {
                    if (name === "Blockquote") stack.push(getQuoteType(view, node));
                    
                    if (name === "QuoteMark") {
                        decorations.push(marks[name](from, to, stack[marksCount]));
                        marksEnd = to;
                        marksCount++;
                    }
                },
                leave({ name, from, to }) {
                    if (name === "Paragraph") {
                        if (marksEnd < end) {
                            decorations.push(marks.quoteLine(marksEnd, end, marksEnd - start));
                        }
                    }
                }
            }
        }
        
        for ( let index = begin; index < lines + begin; index++) {
            const { from, to } = view.state.doc.line(index);
            const { from: s, to: e } = node;
            const selected = hasSelection(view, s, e);
            decorations.push(marks.BlockquoteLine(from, selected));
            
            syntaxTree(view.state).iterate({ from, to, ... iterator(from, to) })
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
    const node_type = node.getChild("QuoteType");
    if (!node_type) return "none";
    const node_text = node_type.getChild("QuoteTypeText");
    if (!node_text) return "none";
    return view.state.sliceDoc(node_text.from, node_text.to).toLowerCase();
}