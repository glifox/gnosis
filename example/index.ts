import { Editor, gutterCompartment, defaultGutterExtensions } from "./editor";

const defaultText = "# Write here...\n\n";
const STORAGE_KEY = "[gnosis:example]";
const WIDTH_KEY = "[gnosis:example:width]";
const GUTTER_KEY = "[gnosis:example:gutter]";

const savedGutter = localStorage.getItem(GUTTER_KEY);
let showGutter = savedGutter === null ? true : savedGutter === "true";

const view = Editor(defaultText, true, STORAGE_KEY, showGutter);
(window as any).editor = view;

const editorContainer = document.querySelector<HTMLElement>(".editor");
const sliderWidth = document.querySelector<HTMLInputElement>("#slider-width");
const inputWidth = document.querySelector<HTMLInputElement>("#input-width");
const fullWidthBtn = document.querySelector<HTMLButtonElement>("#btn-width-full");
const gutterBtn = document.querySelector<HTMLButtonElement>("#btn-gutter");
const resetBtn = document.querySelector<HTMLButtonElement>("#btn-reset");
const printBtn = document.querySelector<HTMLButtonElement>("#btn-print");

function updateSliderBounds() {
  if (!sliderWidth) return;
  const maxAvailable = Math.max(320, Math.floor(window.innerWidth - 40));
  sliderWidth.max = String(maxAvailable);
}

function applyWidth(value: string | number | null, persist = true) {
  if (!editorContainer) return;

  if (value === null || value === "full" || value === "") {
    editorContainer.style.width = "100%";
    const currentPx = Math.round(editorContainer.getBoundingClientRect().width);
    if (sliderWidth) sliderWidth.value = String(currentPx);
    if (inputWidth) inputWidth.value = String(currentPx);
    fullWidthBtn?.classList.add("active");
    if (persist) localStorage.setItem(WIDTH_KEY, "full");
  } else {
    const px = Math.max(320, Math.round(Number(value)));
    editorContainer.style.width = `${px}px`;
    if (sliderWidth) sliderWidth.value = String(px);
    if (inputWidth) inputWidth.value = String(px);
    fullWidthBtn?.classList.remove("active");
    if (persist) localStorage.setItem(WIDTH_KEY, String(px));
  }

  view.requestMeasure();
}

updateSliderBounds();
const savedWidth = localStorage.getItem(WIDTH_KEY);
applyWidth(savedWidth ?? "full", false);

window.addEventListener("resize", () => {
  updateSliderBounds();
  if (localStorage.getItem(WIDTH_KEY) === "full" || !localStorage.getItem(WIDTH_KEY)) {
    applyWidth("full", false);
  }
});

sliderWidth?.addEventListener("input", () => {
  applyWidth(sliderWidth.value);
});

inputWidth?.addEventListener("input", () => {
  if (inputWidth.value) {
    applyWidth(inputWidth.value);
  }
});

fullWidthBtn?.addEventListener("click", () => {
  applyWidth("full");
});

function updateGutterUI() {
  if (!gutterBtn) return;
  gutterBtn.classList.toggle("active", showGutter);
  gutterBtn.setAttribute("aria-pressed", String(showGutter));
}

updateGutterUI();

gutterBtn?.addEventListener("click", () => {
  showGutter = !showGutter;
  localStorage.setItem(GUTTER_KEY, String(showGutter));
  updateGutterUI();
  view.dispatch({
    effects: gutterCompartment.reconfigure(showGutter ? defaultGutterExtensions : []),
  });
});

resetBtn?.addEventListener("click", () => {
  if (window.confirm("Are you sure you want to reset the editor to default content?")) {
    view.dispatch({
      changes: [{ from: 0, to: view.state.doc.length, insert: defaultText }],
    });
    localStorage.setItem(STORAGE_KEY, defaultText);
  }
});

printBtn?.addEventListener("click", () => {
  window.print();
});
