import type { MarkdownConfig, BlockContext, LeafBlock, LeafBlockParser } from "@lezer/markdown";
import { tags as t } from "@lezer/highlight";

// Matches standard GitHub callouts. We allow optional leading whitespace.
const quoteKindRegex = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i;

class GitHubQuoteParser implements LeafBlockParser {
  // Returning false tells the parser we aren't completely consuming the block line-by-line ourselves,
  // allowing Lezer to accumulate the paragraph content for us.
  nextLine() {
    return false; 
  }

  // Once the block ends, this is triggered. We wrap the content in our custom nodes.
  finish(cx: BlockContext, leaf: LeafBlock) {
    let match = quoteKindRegex.exec(leaf.content);
    if (!match) return false;

    let markerLen = match[0].length;

    // Use public APIs `cx.elt` and `cx.addLeafElement` instead of the internal buffer writers
    cx.addLeafElement(leaf, cx.elt("QuoteKind", leaf.start, leaf.start + leaf.content.length, [
      // 1. Mark the [!KIND] text specifically
      cx.elt("QuoteKindMarker", leaf.start, leaf.start + markerLen),
      // 2. Parse the rest of the blockquote content normally
      ...cx.parser.parseInline(leaf.content.slice(markerLen), leaf.start + markerLen)
    ]));

    return true;
  }
}

/// Extension providing GitHub-flavored blockquote callouts.
export const GHQuoteHighlights: MarkdownConfig = {
  defineNodes: [
    { name: "QuoteKind", block: true },
    { name: "QuoteKindMarker", style: t.annotation } // Styles just the [!NOTE] part
  ],
  parseBlock: [{
    name: "QuoteKind",
    leaf(cx, leaf) {
      // Only trigger if we are inside a Blockquote and the pattern matches the start of the line
      return quoteKindRegex.test(leaf.content) && cx.parentType().name === "Blockquote"
        ? new GitHubQuoteParser()
        : null;
    },
    // We insert this before LinkReference so the `[` doesn't trigger standard link parsing
    before: "LinkReference"
  }]
};