import { Prec } from "@codemirror/state";
// import { Editor } from "./components/editor";
import { text } from "./components/text";
import { dynamicTheme } from '@feraxjs/themes-codemirror';
import { Editor } from "../example/editor";


// const editor = Editor({
//   text,
//   extensions: [
//     dynamicTheme
//   ]
// })

Editor(text)