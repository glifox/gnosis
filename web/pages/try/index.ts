import { dynamicTheme } from "@feraxjs/themes-codemirror";
import { Editor } from "../../components/editor";

const editor = Editor({
  text: '# Write here...',
  save: true,
  key: "gnosis-try-editor-content",
  extensions: [
    dynamicTheme
  ]
})
