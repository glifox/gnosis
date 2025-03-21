import { syntaxTree } from "@codemirror/language";

export const mousedown = (e, view) => {
    let target = e.target; /* as HTMLElement */

    if (
        target.nodeName === "BUTTON" &&
        target.parentElement?.classList.contains("wg-codeblock")
    ) {
        const types = ["FencedCode", "CodeBlock"];

        let code = "";
        const iterate = {
            enter: ({ type: { name }, from, to, node }) => {
                if (types.includes(name)) code = getCode(view, node.toTree(), from, to);
                return !types.includes(name);
            },
        };

        syntaxTree(view.state).iterate({
            ...iterate,
            from: view.posAtDOM(target),
            to: view.posAtDOM(target) + 2,
        });
        
        navigator.clipboard.writeText(code);
        
        return true;
    }
};

const getCode = (view, tree, from, to) => {
    const marks = ["CodeMark", "CodeInfo"];
    
    let text = view.state.doc.sliceString(from, to);
    let lines2remove = new Set();
    tree.iterate({
        enter({ type: { name }, from: from2, node }) {
            if (marks.includes(name)) lines2remove.add(view.state.doc.lineAt(from2 + from).number);
        },
    });
    
    const startLine = view.state.doc.lineAt(from);
    const offset = from - startLine.from;
    
    const lines = [];
    text.split('\n').forEach((line, index) => {
        if (!lines2remove.has(index + startLine.number)) 
            lines.push(line.slice(offset));
    });
    
    return lines.join('\n');
};
