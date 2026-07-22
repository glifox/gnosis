import { EditorView } from "codemirror";

export const coreTheme = () => {
  return EditorView.baseTheme({
    "& .cm-pointmark": {
      position: "relative",
      color: "transparent",
    },

    "& .cm-pointmark::before": {
      content: '""',
      display: "inline",
      position: "absolute",
      borderRadius: "50%",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      height: ".4em",
      width: ".4em",
    },
    
    "&light .cm-pointmark::before": { backgroundColor: "var(--cm-list-pointmark, black)" },
    "&dark  .cm-pointmark::before": { backgroundColor: "var(--cm-list-pointmark, white)" },
    
    "& .cm-pointmark.mk-show::before": { backgroundColor: 'transparent' }
    
    
  });
};
