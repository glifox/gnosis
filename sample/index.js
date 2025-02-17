import {EditorView, minimalSetup} from "codemirror"
import { EditorState } from "@codemirror/state";

import { text } from "./text"
import gnosis from "../src/exports";

const editor = new EditorView({
    doc: text,
    extensions: [
        minimalSetup,
        EditorView.lineWrapping,
        EditorView.clickAddsSelectionRange.of(e => e.altKey),
        EditorState.allowMultipleSelections.of(true),
        gnosis(),
    ],
    parent: document.querySelector(".editor")
})
