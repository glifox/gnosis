import {EditorView, minimalSetup} from "codemirror"
import { EditorState } from "@codemirror/state";

import { gnosis } from "../../src/exports";

export const Editor = (text) => new EditorView({
    doc: text,
    extensions: [
        minimalSetup,
        EditorView.lineWrapping,
        EditorView.clickAddsSelectionRange.of(e => e.altKey),
        EditorState.allowMultipleSelections.of(true),
        gnosis(),
    ],
    parent: document.querySelector(".editor")
});