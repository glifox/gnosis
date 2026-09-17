import { Prec } from "@codemirror/state";
import { Editor } from "./components/editor";
import { text } from "./components/text";
import { dynamicTheme } from '@feraxjs/themes-codemirror';


const editor = Editor({
  text,
  extensions: [
    dynamicTheme
  ]
})
