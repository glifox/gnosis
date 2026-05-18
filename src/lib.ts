import { markdown } from "@codemirror/lang-markdown";
import { GFM } from "@lezer/markdown";

import { HighlightStyle, syntaxHighlighting /* , defaultHighlightStyle */} from "@codemirror/language";
import { languages } from "@codemirror/language-data"

import type { Extension } from "@codemirror/state";
import { tags } from "@lezer/highlight";
import { hideMarks } from "./plugins/hidemarks";
import { code } from "./plugins/block/code/plugin";
import { headings } from "./plugins/block/heading";
import { EditorView } from "codemirror";
import { breakes } from "./plugins/lineDetector";

export const gnosis: () => Extension = () => [
  EditorView.lineWrapping,
  syntaxHighlighting(defaultHighlightStyle),
  markdown({
    codeLanguages: languages,
    extensions: [ GFM ]
  }),
  hideMarks,
  headings,
  code(),
  breakes
]

export const defaultHighlightStyle = HighlightStyle.define([
  {tag: tags.meta,
   color: "#404740"},
  {tag: tags.link,
   textDecoration: "underline"},
  {tag: tags.heading,
   textDecoration: "underline",
   fontWeight: "bold"},
  {tag: tags.emphasis,
   fontStyle: "italic"},
  {tag: tags.strong,
   fontWeight: "bold"},
  {tag: tags.strikethrough,
   textDecoration: "line-through"},
  {tag: tags.keyword,
   color: "red"},
  {tag: [tags.atom, tags.bool, tags.url, tags.contentSeparator, tags.labelName],
   color: "red"},
  {tag: [tags.literal, tags.inserted],
   color: "#164"},
  {tag: [tags.string, tags.deleted],
   color: "#a11"},
  {tag: [tags.regexp, tags.escape, tags.special(tags.string)],
   color: "#e40"},
  {tag: tags.definition(tags.variableName),
   color: "#00f"},
  {tag: tags.local(tags.variableName),
   color: "#30a"},
  {tag: [tags.typeName, tags.namespace],
   color: "#085"},
  {tag: tags.className,
   color: "#167"},
  {tag: [tags.special(tags.variableName), tags.macroName],
   color: "#256"},
  {tag: tags.definition(tags.propertyName),
   color: "#00c"},
  {tag: tags.comment,
   color: "#940"},
  {tag: tags.invalid,
   color: "#f00"}
])
