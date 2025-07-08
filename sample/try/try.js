import { catppuccin, themeVariant } from "../../src/exports";
import { Editor } from "../editor/editor"


const editor = Editor("Just write here...", true, 'gnosis-try-editor-content')

const themes = [
    document.querySelector("#mocha"),
    document.querySelector("#latte"),
    document.querySelector("#frappe"),
    document.querySelector("#macchiato")
];

themes.forEach(theme => { 
    theme.addEventListener("click", () => { 
        editor.dispatch({
            effects: themeVariant.reconfigure(catppuccin(theme.id))
        })
    })
})

document.querySelector(".editor").removeChild(document.querySelector(".wraper-loader"));

const reset = document.querySelector(".btn.reset");
reset.addEventListener("click", () => {
    editor.dispatch({
        changes: [{ from: 0, to: editor.state.doc.length, insert: "Just write here..." }]
    })
});

const print = document.querySelector(".btn.print");
print.addEventListener("click", () => {
    window.print();
})