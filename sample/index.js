
import { Editor } from "./editor/editor"
import { text } from "./text"

const editor = Editor(text);

document.querySelector(".editor").removeChild(document.querySelector(".wraper-loader"))