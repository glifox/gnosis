import { Editor } from "../../components/editor";

const defaultText = "# Write here...\n\n";

const editor = Editor({
  text: defaultText,
  save: true,
  key: "gnosis-try-editor-content",
});

const resetBtn = document.querySelector<HTMLButtonElement>("#btn-reset");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    if (window.confirm("Are you sure you want to reset the editor to default content?")) {
      editor.dispatch({
        changes: [{ from: 0, to: editor.state.doc.length, insert: defaultText }]
      });
      localStorage.setItem("gnosis-try-editor-content", defaultText);
    }
  });
}

const printBtn = document.querySelector<HTMLButtonElement>("#btn-print");
if (printBtn) {
  printBtn.addEventListener("click", () => {
    window.print();
  });
}
