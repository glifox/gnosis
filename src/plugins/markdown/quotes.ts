import type { MarkdownConfig, BlockContext, LeafBlock, LeafBlockParser } from "@lezer/markdown";
import { tags as t } from "@lezer/highlight";

// Permite [!KIND] con espacios o tabs al final, pero nada de texto adicional.
// Usamos [ \t]* en lugar de \s* para evitar comportamientos extraños con saltos de línea.
const quoteKindRegex     = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*$/i;
const markerExtractRegex = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i;

class GitHubQuoteParser implements LeafBlockParser {
  // "Sigue agregando las siguientes líneas de este blockquote a este mismo bloque".
  nextLine() {
    return false; 
  }

  finish(cx: BlockContext, leaf: LeafBlock) {
    let match = markerExtractRegex.exec(leaf.content);
    if (!match) return false;

    let markerLen = match[0].length;

    cx.addLeafElement(leaf, cx.elt("QuoteKind", leaf.start, leaf.start + leaf.content.length, [
      cx.elt("QuoteKindMarker", leaf.start, leaf.start + markerLen),
      
      // 2. Pasamos el resto del contenido
      ...cx.parser.parseInline(leaf.content.slice(markerLen), leaf.start + markerLen)
    ]));

    return true;
  }
}

/// Extensión para soportar los callouts de GitHub dentro de Blockquotes.
export const GHQuoteHighlights: MarkdownConfig = {
  defineNodes: [
    { name: "QuoteKind", block: true },
    { name: "QuoteKindMarker", style: t.processingInstruction }
  ],
  parseBlock: [{
    name: "QuoteKind",
    leaf(cx, leaf) {
      // No es válido si está anidado dentro de otro quoteblock.
      let quoteDepth = 0;
      for (let i = 0; i < cx.depth; i++) {
        if (cx.parentType(i).name === "Blockquote") {
          quoteDepth++;
        }
      }
      if (quoteDepth !== 1) return null;

      // Solo es válido en la primera línea del quoteblock.
      if ((cx as any).block.from < cx.lineStart) {
        return null;
      }

      // Solo es válido si es lo único presente en la línea (ignorando espacios).
      if (!quoteKindRegex.test(leaf.content)) {
        return null;
      }

      // Si pasa todas las reglas, iniciamos nuestro parser de párrafo personalizado.
      return new GitHubQuoteParser();
    },
    // Lo interceptamos antes de que se confunda con un LinkReference
    before: "LinkReference" 
  }]
};