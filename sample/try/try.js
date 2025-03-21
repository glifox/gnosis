import { catppuccin, themeVariant } from "../../src/exports";
import { Editor } from "../editor/editor"


const editor = Editor("Just write here...")

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

document.querySelector(".editor").removeChild(document.querySelector(".wraper-loader"))