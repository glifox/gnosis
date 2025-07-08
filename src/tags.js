import {styleTags, Tag} from "@lezer/highlight"

const none = Tag.define("none")
const umarks = styleTags({
    "Blockquote/...": none,
    HorizontalRule: none,
    "ATXHeading1/... SetextHeading1/...": none,
    "ATXHeading2/... SetextHeading2/...": none,
    "ATXHeading3/...": none,
    "ATXHeading4/...": none,
    "ATXHeading5/...": none,
    "ATXHeading6/...": none,
    "Comment CommentBlock": none,
    Escape: none,
    Entity: none,
    "Emphasis/...": none,
    "StrongEmphasis/...": none,
    "Strikethrough/...": none,
    "TableHeader/...": none,
    "Link/... Image/...": none,
    "OrderedList/... BulletList/...": none,
    "BlockQuote/...": none,
    "InlineCode CodeText": none,
    "URL Autolink": none,
    "HeaderMark HardBreak QuoteMark ListMark LinkMark EmphasisMark CodeMark StrikethroughMark": none,
    "CodeInfo LinkLabel TaskMarker TableDelimiter": none,
    LinkTitle: none,
    Paragraph: none,
    "QuoteType/.. QuoteTypeMark QuoteTypeText": none
});

export const unsetMarks = { props: [umarks] };