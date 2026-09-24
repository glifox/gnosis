import './html/scroller';

import { BlockWrapper, Decoration, highlightActiveLineGutter, WidgetType, type DecorationSet } from "@codemirror/view";
import { EditorSelection, type Range, type RangeSet, type Transaction } from "@codemirror/state";
import { EditorView } from "codemirror";
import { hasSelection, visibleNodes } from "../../../utils";
import { getLineFont as getNodeFont, mesureOffset } from '../../breaks';
import { CopyCode, wrap_class } from './html/copy/widget';


export const background_class = "cm-codeblock-background" as const;
export const scroller_class = "cm-codeblock-scroller" as const;
export const spacer_class = "cm-codeblock-spacer" as const;
export const content_class = "cm-codeblock-content" as const;

const codeblock = (class_: string) => BlockWrapper.create({
  tagName: 'div',
  attributes: { class: class_ }
})

const scroller = (class_: string, offset: number) => BlockWrapper.create({
  tagName: 'code-scroller',
  attributes: {
    class: class_,
    "data-offset": `${offset}`,
  }
})

const spacer = Decoration.mark({
  class: spacer_class,
  attributes: {
    // style: 'background-color: hsl(from blue h s l / .1);'
  }
})

const content = Decoration.mark({
  class: content_class,
  attributes: {
    // style: 'background-color: hsl(from blue h s l / .1);'
  }
})

const copycode = () => Decoration.widget({
  widget: new CopyCode(),
  side: -1
})

const wrappers = {
  CodeBlock: ({ from, to, offset, selected }: { from: number, to: number, offset: number, selected: boolean }) => [
    scroller(scroller_class, offset).range(from, to),
    codeblock(background_class + (selected ? ' sl' : '')).range(from, to),
  ],
  FencedCode: ({ from, to, offset, selected }: { from: number, to: number, offset: number, selected: boolean }) => [
    scroller(scroller_class, offset).range(from, to),
    codeblock(background_class + (selected ? ' sl' : '')).range(from, to),
  ],
}


export function decorator(view: EditorView, config: null): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  
  visibleNodes(view, {
    enter: ({ name, from, to }) => {
      if (name in wrappers) {
        const startLine = view.state.doc.lineAt(from);
        const endLine = view.state.doc.lineAt(to);

        // Si el bloque no empieza en la columna 0, tenemos un offset
        const offset = from - startLine.from;
        
        if (offset > 0) {
          // 1. Primera línea: Decoramos desde el inicio de la línea hasta 'from'
          decorations.push(spacer.range(startLine.from, from));
          decorations.push(content.range(from, startLine.to));
          
          // 2. Líneas siguientes: Decoramos los primeros 'offset' caracteres de cada línea
          for (let l = startLine.number + 1; l <= endLine.number; l++) {
            const currentLine = view.state.doc.line(l);

            // Aseguramos que no intentemos decorar más allá de la longitud real de la línea
            const lineOffset = Math.min(offset, currentLine.length);
            
            const lineStart = currentLine.from;
            if (lineOffset > 0) decorations.push(spacer.range(lineStart, lineStart + lineOffset));
            if (lineStart + lineOffset < currentLine.to ) decorations.push(content.range(lineStart + lineOffset, currentLine.to));
            
            // if (lineOffset < offset) decorations.push(
            //   Decoration
            //     .widget({ widget: new Span(" ".repeat(offset - lineOffset)) })
            //     .range(lineStart + lineOffset));
          }
        } else {
          for (let l = startLine.number; l <= endLine.number; l++) {
            const currentLine = view.state.doc.line(l);
            if (currentLine.from < currentLine.to) decorations.push(content.range(currentLine.from, currentLine.to));
          }
        }

        if (endLine.from == view.state.doc.length) {
          decorations.push(copycode().range(startLine.from))
        }
        else decorations.push(copycode().range(endLine.from))
      }
    }
  });

  return Decoration.set(decorations, true);
}
export const provide = () => EditorView.blockWrappers.of(v => wrapper(v))
function wrapper(view: EditorView): RangeSet<BlockWrapper> {
  const decorations: Range<BlockWrapper>[] = [];

  visibleNodes(view, {
    enter: ({ name, from, to }) => {
      if (name in wrappers) {
        const line = view.state.doc.lineAt(from)
        const offset = from - line.from;
        const selected = hasSelection(view, from, to)
        decorations.push(
          ...wrappers[name as keyof typeof wrappers]({
            from: line.from,
            to,
            offset: offset,
            selected,
          })
        )
        
        requestAnimationFrame(() => {
          const node = view.domAtPos(line.from).node.parentElement;
          // console.info(`node:`, node);
          if (!node) return;
          
          const wraperDom = node.closest(`.${background_class}`);
          if (!wraperDom) return;
          
          const spacer = wraperDom.querySelector(`.${spacer_class}`);
          
          const width = spacer?.getBoundingClientRect().width ?? 0;
          (wraperDom as HTMLElement).style.setProperty('--left-padding', `${width + 4}px`)
        })
      }
    }
  });

  return BlockWrapper.set(decorations, false);
}

// class Span extends WidgetType {
//   constructor(public text: string) { super() }
//   toDOM() {
//     const span = document.createElement("span")
//     span.style.color = 'transparent'
//     span.style.backgroundColor = 'hsl(from red h s l / .1)'
//     span.innerText = `${this.text}`
    
//     return span
//   }
//   override get lineBreaks() { return 0 }
//   override eq(other: Span) {
//     return other.text === this.text
//   }
// }
