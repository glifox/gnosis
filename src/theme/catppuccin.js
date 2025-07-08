import { EditorView } from "@codemirror/view";
import { Compartment } from "@codemirror/state";
import { flavors } from "@catppuccin/palette";
import { unblendColor } from "../plugins/common/usefull";
import { createTheme } from "thememirror";
import { tags as t } from "@lezer/highlight";

export const themeVariant = new Compartment();

export const catppuccin = (flavor = "latte") => {
    const colors = flavors[flavor].colors;

    const base = colors.base;
    const text = flavor === "latte" ? "#484b64" : colors.text.hex;
    const codebg = calcBackground(colors.crust.rgb, base.rgb, 0.1);
    
    const root = document.querySelector(':root');
    root.style.setProperty('--editor-background', base.hex);
    
    return [
      createTheme({
        variant: flavor === "latte" ? "light" : "dark",
        settings: {
          background: base.hex,
          foreground: text,
          caret: colors.rosewater.hex,
          // selection: selection,
          lineHighlight: rgba(colors.overlay1.rgb, 0.1),
          gutterBackground: base.hex,
          gutterForeground: text,
        },
        styles: [
            // python
            { tag: t.modifier, color: colors.mauve.hex },
            { tag: t.controlKeyword, color: colors.mauve.hex },
            { tag: t.operatorKeyword, color: colors.mauve.hex },
            { tag: t.definitionKeyword, color: colors.mauve.hex },
            { tag: t.moduleKeyword, color: colors.mauve.hex },
            { tag: t.bool, color: colors.peach.hex },
            { tag: t.null, color: colors.peach.hex },
            { tag: t.null, color: colors.peach.hex },
            { tag: [t.function(t.variableName)], color: colors.blue.hex },
            { tag: [t.function(t.definition(t.variableName))], color: colors.blue.hex },
            { tag: [t.definition(t.className)], color: colors.yellow.hex, fontWeight: "bold" },
            { tag: t.propertyName, color: colors.blue.hex },
            { tag: [t.function(t.propertyName)], color: colors.blue.hex },
            { tag: t.lineComment, color: colors.overlay2.hex },
            { tag: t.number, color: colors.peach.hex },
            { tag: t.string, color: colors.green.hex },
            { tag: [t.special(t.string)], color: colors.green.hex, fontWeight: "600" },
            { tag: t.arithmeticOperator, color: colors.sky.hex },
            { tag: t.bitwiseOperator, color: colors.sky.hex },
            { tag: t.compareOperator, color: colors.sky.hex },
            { tag: t.definitionOperator, color: colors.sky.hex },
            { tag: t.punctuation, color: colors.peach.hex },
            { tag: t.meta, color: colors.teal.hex },
            { tag: t.paren, color: colors.overlay2.hex },
            { tag: t.squareBracket, color: colors.overlay2.hex },
            { tag: t.brace, color: colors.overlay2.hex },
            { tag: t.derefOperator, color: colors.overlay2.hex },
            { tag: t.separator, color: colors.overlay2.hex },
            // c++
            { tag: t.definitionKeyword, color: colors.mauve.hex },
            { tag: t.self, color: colors.red.hex },
            { tag: [t.standard(t.typeName)], color: colors.yellow.hex }, // (void, int, ...)
            { tag: t.typeName, color: colors.yellow.hex }, // no necesary good
            { tag: t.namespace, color: colors.yellow.hex }, // no necesary good
            { tag: t.labelName, color: colors.teal.hex }, // no necesary good
            { tag: t.variableName, color: text }, // no necesary good
            { tag: t.operator, color: colors.sky.hex },
            { tag: t.logicOperator, color: colors.sky.hex },
            { tag: t.updateOperator, color: colors.sky.hex }, // no necesary good
            { tag: t.character, color: colors.green.hex },
            { tag: t.escape, color: colors.pink.hex },
            { tag: t.literal, color: colors.sky.hex },
            { tag: t.processingInstruction, color: colors.mauve.hex },
            // { tag: [t.special(t.name)], color: colors.red.hex },
            { tag: t.angleBracket, color: colors.overlay2.hex },
            // css
            { tag: t.keyword, color: colors.yellow.hex },
            { tag: t.tagName, color: colors.blue.hex },
            { tag: t.className, color: colors.teal.hex },
            { tag: [t.constant(t.className)], color: colors.teal.hex }, // no necesary good
            { tag: t.attributeName, color: colors.peach.hex }, // no necesary good
            { tag: t.atom, color: colors.yellow.hex }, // no necesary good
            { tag: t.unit, color: colors.yellow.hex },
            { tag: t.color, color: colors.pink.hex },
            // Rust
            { tag:  t.macroName, color: colors.peach.hex },
            
        ]
      }), EditorView.theme({
        // Editor
        "& .cm-selectionBackground, ::selection": { background: `${rgba(colors.overlay2.rgb, .3)} !important` },
        
        // Code
        "& .cb-content, & .ic": { backgroundColor: codebg },
        ".cb-icon": { fill: text },
        ".wg-codeblock-btn:hover": { backgroundColor: rgba(colors.overlay1.rgb, .2) },
        

        // Blockquote
        ".bq-none-mark":      {"--bq-none-mark": text },
        ".bq-note-mark":      {"--bq-note-mark": colors.blue.hex },
        ".bq-tip-mark":       {"--bq-tip-mark": colors.green.hex },
        ".bq-warning-mark":   {"--bq-warning-mark": colors.peach.hex },
        ".bq-important-mark": {"--bq-important-mark": colors.mauve.hex },
        ".bq-caution-mark":   {"--bq-caution-mark": colors.red.hex },
        
        ".wg-qt-icon":      {
            "--bq-none-mark": text,
            "--bq-note-mark": colors.blue.hex,
            "--bq-tip-mark": colors.green.hex,
            "--bq-warning-mark": colors.peach.hex,
            "--bq-important-mark": colors.mauve.hex,
            "--bq-caution-mark": colors.red.hex
        },
        
        // Links
        "& a.url": { color: colors.blue.hex },
        "& a.url:visited": { color: colors.mauve.hex },

        // Html
        "& .cm-rendered-tag": {
            border: `1px solid ${colors.surface2.hex}`,
            borderRadius: "4px",
            fontSize: ".8em",
            padding: "0px 3px",
            background: colors.surface0.hex,
        }
      }, { dark: flavor !== "latte" })
    ];

};

const calcBackground = (rgb, rgbb, opacity) => {
    const desired = [rgb.r, rgb.g, rgb.b];
    const background = [rgbb.r, rgbb.g, rgbb.b];

    const final = unblendColor(desired, background, opacity, 0.3);

    return `rgba(${final.join(", ")})`;
};

const rgba = (rgb, a) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
