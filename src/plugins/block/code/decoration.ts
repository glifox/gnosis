import type { EditorView } from "codemirror";
import { hasSelection } from "../../../utils";
import type { Options } from "./plugin";
import { Decoration } from "@codemirror/view";
import { CopyCode } from "./copy/widget";
import { BrWraper } from "./widget";

export const decorationCodeblock = (
  view: EditorView,
  from: number,
  to: number,
  stack: any[],
  options: Options,
) => {
    const marginLeft = options.marginLeft;
    const paddingLeft = options.paddingLeft;
    const decorations = [];
    const father = stack[stack.length - 1];
    const isListed = ["BulletList", "OrderedList", "ListItem"].some(s => s === father.name);
    const isQuoted = ["Blockquote"].some(s => s === father.name);
    
    const startLine = view.state.doc.lineAt(from);
    const offset = from - startLine.from;
    const isSpaced = offset > 0;

    const selected = hasSelection(view, startLine.from, to);
    decorations.push(
        Decoration.widget({ widget: new CopyCode(), side: 0 }).range(from+1)
    );
    
    const begin = startLine.number;
    const lines = view.state.doc
        .sliceString(from, to).split('\n').length;
    
    for ( let i = begin; i < lines + begin; i++) {
        const { from, to } = view.state.doc.line(i);
        const baseWidth = `100% - ${marginLeft + paddingLeft}px`;
        
        const class_ = ["cb-content"];
        
        if (selected) class_.push("sw");
        if ( i === begin  ) class_.push("cb-start");
        if ( i === lines + begin - 1 ) class_.push("cb-end");

        const start = Math.max(from + offset, 0);
        
        if (to < start) {
          decorations.push(...[
              Decoration.widget({ 
                  widget: new BrWraper(
                      ["left", "cb-error"].join(" "), 
                    `0.1px`,
                  )
                  , side: 0 
              }).range(to),
              Decoration.widget({ 
                  widget: new BrWraper(
                    ["cb-error", "right"].join(" "),
                    ``, ``, start - to
                  )
                  , side: 1 
              }).range(to)
          ]);
        }
        else if ( from === to && from === start ) {
          decorations.push(...[
              Decoration.widget({ 
                  widget: new BrWraper(
                      [...class_, "left"].join(" "), 
                      `0`,
                  )
                  , side: 0 
              }).range(to),
              Decoration.widget({ 
                  widget: new BrWraper(
                    class_.join(" "),
                      `calc(${baseWidth} - ${paddingLeft}px)`,
                      "0"
                  )
                  , side: 1 
              }).range(start)
          ]);
        }
        else if ( start === to ) {
            class_.push("wg");
            
            decorations.push(
                Decoration.widget({ 
                    widget: new BrWraper(
                        class_.join(" "), 
                        `calc(${baseWidth} - ${start - from}ch)`
                    )
                    , side: 1 
                }).range(start)
            );
        } 
        else if (isListed || isQuoted || isSpaced) {
            const attributes = { style: `width: calc(${baseWidth} - ${start - from}ch)` }
            if (to > start) decorations.push(Decoration.mark({ class: class_.join(" "), attributes }).range(start, to))
            
            if (from !== start && isListed) decorations.push(Decoration.mark({ class: "cb-listsp" }).range(from, start))
            if (from !== start && isSpaced) decorations.push(Decoration.mark({ class: "cb-spacer" }).range(from, start))
            if (from !== start && isQuoted) decorations.push(Decoration.mark({ class: "cb-quote bq" }).range(from, start))
        }
        else if ( from !== to ) {
            const attributes = { style: `width: calc(${baseWidth})` }   
            decorations.push(Decoration.mark({ class: class_.join(" "), attributes }).range(from, to))
        }
        
        decorations.push(Decoration.line({ class: "cb-line" }).range(from))
    }

    return decorations
}
