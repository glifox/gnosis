import { Decoration, EditorView } from "@codemirror/view";
import { StateField, StateEffect } from "@codemirror/state";
import { hasSelection, visibleNodes } from "../../common/usefull";
import { HtmlWidget } from "./widget";

export const updateHtmlBlocks = StateEffect.define();

export const htmlBlockField = StateField.define({
    create(state) { return Decoration.none; },
    update(decorations, tr) {
        decorations = decorations.map(tr.changes);

        for (let e of tr.effects) {
            if (e.is(updateHtmlBlocks)) {
                return e.value;
            }
        }

        return decorations;
    },

    provide: (f) => EditorView.decorations.from(f),
});

export function decorator(view) {
    const blocks = {
        HTMLBlock: (from, to) => {
            const content = view.state.doc.sliceString(from, to);
            
            return Decoration.replace({
                widget: new HtmlWidget(content),
                inclusive: false,
            }).range(from, to)
        },
    }
    
    const widgets = [];

    visibleNodes(view, {
        enter: ({ type, from, to, node }) => {
            if (
                type.name in blocks &&
                (
                    !hasSelection(view, from, to) ||
                    !view.hasFocus
                )
            ) widgets.push(blocks[type.name](from, to));
        },
    });

    return Decoration.set(widgets);
}
