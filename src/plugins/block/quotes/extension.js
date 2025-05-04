import { tags as t } from "@lezer/highlight";

const QuoteTypeParser = {
    name: "QuoteTypeParser",
    parse(cx, line) {
        const isInsideBlockquote = () => {
            for (let i = 0; i < cx.depth; i++) {
                if (cx.parentType(i).name === "Blockquote") return true;
            }
            return false;
        };

        if (isInsideBlockquote()) {
            const match = line.text.match(/^(\s*>\s*)+(\[!\w+\])\s*$/);
            
            if (match && match[2]) {
                const quoteType = match[2];
                const start = line.text.indexOf(quoteType);
                const end = start + quoteType.length;
                
                const quoteTypeElement = cx.elt("QuoteType", cx.lineStart + start, cx.lineStart + end);
                quoteTypeElement.children = [
                    cx.elt("QuoteTypeMark", cx.lineStart + start, cx.lineStart + start + 2),
                    cx.elt("QuoteTypeText", cx.lineStart + start + 2 , cx.lineStart + end - 1),
                    cx.elt("QuoteTypeMark", cx.lineStart + end - 1, cx.lineStart + end)
                ];
                cx.addElement(quoteTypeElement);
                console.log(cx);
            }
        }

        return false;
    },
};

export const QuoteType = {
    defineNodes: [
        { name: "QuoteType", style: { "QuoteType/...": t.content } },
        { name: "QuoteTypeMark", style: t.processingInstruction },
        { name: "QuoteTypeText", style: t.bool },
    ],
    parseBlock: [QuoteTypeParser],
};