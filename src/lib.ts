// import { EditorView } from "codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { GFM } from "@lezer/markdown";
import { template } from "./plugins/block/templates/plugin";

import { HighlightStyle, syntaxHighlighting /* , defaultHighlightStyle */} from "@codemirror/language";
import { languages } from "@codemirror/language-data"

import { Prec, type Extension } from "@codemirror/state";
import { styleTags, Tag } from "@lezer/highlight"
import { tags } from "@lezer/highlight";
import { hideMarks } from "./plugins/hidemarks";
import { code } from "./plugins/block/code/plugin";
import { headings } from "./plugins/block/heading/plugin";
import { breakes } from "./plugins/breaks";
import { ListPlugin } from "./plugins/block/list/plugin";
import { GHQuoteHighlights } from "./plugins/markdown/quotes";
import { quotes } from "./plugins/block/quote/plugin";
import { inline } from "./plugins/inline";

const none: Tag = Tag.define("none")
const umarks  = styleTags({
  "QuoteMark": none,
  "QuoteKindMarker QuoteKind": none,
});

export const unsetMarks = { props: [umarks] };

export const gnosis: () => Extension = () => [
  markdown({
    codeLanguages: languages,
    extensions: [GFM, GHQuoteHighlights(), unsetMarks],
    addKeymap: false,
    
  }),
  hideMarks,
  inline,
  headings(),
  breakes,
  ListPlugin(),
  quotes(),
  Prec.lowest(code()),
  // template(),
]
