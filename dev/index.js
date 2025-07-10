import { Editor } from "../sample/editor/editor"
// import { catppuccin, themeVariant } from "../src/exports";
import { text } from "./current"

const editor = Editor(text);

const themes = [
    document.querySelector("#mocha"),
    document.querySelector("#latte"),
    document.querySelector("#frappe"),
    document.querySelector("#macchiato")
];

// themes.forEach(theme => { 
//     theme.addEventListener("click", () => { 
//         editor.dispatch({
//             effects: themeVariant.reconfigure(catppuccin(theme.id))
//         })
//     })
// })


