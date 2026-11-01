import { Editor, gutterCompartment, defaultGutterExtensions } from "./editor";

const defaultText = "# Write here...\n\n";
const STORAGE_KEY = "[gnosis:example]";
const WIDTH_KEY = "[gnosis:example:width]";
const SLIDER_KEY = "[gnosis:example:slider]";
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
    const savedSlider = localStorage.getItem(SLIDER_KEY);
    const displayVal = savedSlider ? savedSlider : String(currentPx);
    if (sliderWidth) sliderWidth.value = displayVal;
    if (inputWidth) inputWidth.value = displayVal;
    fullWidthBtn?.classList.add("active");
    if (persist) {
      localStorage.setItem(WIDTH_KEY, "full");
    }
  } else {
    const px = Math.max(320, Math.round(Number(value)));
    editorContainer.style.width = `${px}px`;
    if (sliderWidth) sliderWidth.value = String(px);
    if (inputWidth) inputWidth.value = String(px);
    fullWidthBtn?.classList.remove("active");
    if (persist) {
      localStorage.setItem(WIDTH_KEY, String(px));
      localStorage.setItem(SLIDER_KEY, String(px));
    }
  }

  view.requestMeasure();
}

updateSliderBounds();
const savedSlider = localStorage.getItem(SLIDER_KEY);
const savedWidth = localStorage.getItem(WIDTH_KEY);

if (savedSlider) {
  if (sliderWidth) sliderWidth.value = savedSlider;
  if (inputWidth) inputWidth.value = savedSlider;
}

if (savedWidth === "full") {
  applyWidth("full", false);
} else if (savedWidth !== null) {
  applyWidth(savedWidth, false);
} else if (savedSlider !== null) {
  applyWidth(savedSlider, false);
} else {
  applyWidth(sliderWidth?.value || "900", false);
}

window.addEventListener("resize", () => {
  updateSliderBounds();
  if (localStorage.getItem(WIDTH_KEY) === "full") {
    applyWidth("full", false);
  }
});

sliderWidth?.addEventListener("input", () => {
  applyWidth(sliderWidth.value, true);
});

sliderWidth?.addEventListener("change", () => {
  applyWidth(sliderWidth.value, true);
});

inputWidth?.addEventListener("input", () => {
  if (inputWidth.value) {
    applyWidth(inputWidth.value, true);
  }
});

inputWidth?.addEventListener("change", () => {
  if (inputWidth.value) {
    applyWidth(inputWidth.value, true);
  }
});

fullWidthBtn?.addEventListener("click", () => {
  const isFull = fullWidthBtn.classList.contains("active");
  if (isFull) {
    const targetWidth = localStorage.getItem(SLIDER_KEY) || sliderWidth?.value || "900";
    applyWidth(targetWidth, true);
  } else {
    if (sliderWidth?.value) {
      localStorage.setItem(SLIDER_KEY, sliderWidth.value);
    }
    applyWidth("full", true);
  }
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
