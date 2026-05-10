import { markdownLanguage } from "@codemirror/lang-markdown";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const headingsStyles = HighlightStyle.define([
  { tag: tags.heading, lineHeight: "2.4lh" },
  { tag: tags.heading1, fontSize: "2.00em", fontWeight: "bolder" },
  { tag: tags.heading2, fontSize: "1.55em", fontWeight: "bolder" },
  { tag: tags.heading3, fontSize: "1.35em", fontWeight: "bolder" },
  { tag: tags.heading4, fontSize: "1.25em", fontWeight: "bolder" },
  { tag: tags.heading5, fontSize: "1.25em", fontWeight: "semi-bold" },
  { tag: tags.heading6, fontSize: "1.25em", fontWeight: "normal" },
], {
  scope: markdownLanguage
})

export const headings = syntaxHighlighting(headingsStyles);
