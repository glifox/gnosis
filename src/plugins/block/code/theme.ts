import { EditorView } from "codemirror";
import { background_class, scroller_class, content_class, spacer_class, marking_class, codeinfo_class } from "./decorator";
import { boton_class, wrap_class } from "./html/copy/widget";
import { header_class, lang_class, path_class } from "./html/header/widget";

const border = { border: "red solid 1px" }

export const coreTheme = () => {
  const padding_horizontal = '4px';
  
  return EditorView.baseTheme({
    [`.${scroller_class}`]: { 
      display: "grid",
      fontFamily: "monospace",
      overflowX: "auto",
      overflowY: "hidden",

      scrollbarWidth: "thin",
      scrollbarColor: "transparent transparent",
      overscrollBehaviorX: "none",
      overscrollBehaviorY: "auto",
    },
    [`.${spacer_class}`]: { 
      left: '6px',
      position: 'sticky',
    },
    [`.${content_class}`]: { 
      "--gap": "calc(var(--left-padding, 0px) + 10px)",
      
      display: "inline-block",
      width: "calc(100% - var(--left-padding, 0px) + 4px)",
      marginLeft: `calc(4px + ${padding_horizontal})`,
      
      maskImage: "linear-gradient(to right, transparent var(--gap), black 0)",
      WebkitMaskImage: "linear-gradient(to right, transparent var(--gap), black 0)",
      
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
      
      maskPosition: "calc(var(--scroll-x, 0px) - var(--gap)) 0",
      WebkitMaskPosition: "calc(var(--scroll-x, 0px) - var(--gap)) 0",
      
      willChange: "mask-position"
    },
    [`.${background_class}`]: { 
      position: "relative",
      marginRight: `calc(${padding_horizontal} + 4px)`,
    },
    [`.${background_class}::before`]: {
      content: "\"\"",
      backgroundColor: "hsl(from gray h s l / .1)",
      position: "absolute",
      height: "100%",
      top: "0",
      left: `calc(var(--left-padding, 0) + ${padding_horizontal})`,
      right: `-${padding_horizontal}`,
      borderRadius: "12px",
      
      zIndex: "-80",
    },
    [`.${background_class}.sl .${wrap_class}`]: {
      position: "unset",
      width: "0",
      height: "0",
      overflow: "hidden",
    },
    [`& .${wrap_class}`]: {
      display: "inline-block",
      position: "absolute",
      top: "0",
      right: "0",
      zIndex: "900",
    },
    [`& .${header_class}`]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: "0",
      left: "calc(50% + var(--left-padding, 0px) / 2)",
      transform: "translateX(-50%)",
      zIndex: "900",
      height: "1lh",
      pointerEvents: "none",
      gap: "0.6ch",
      fontFamily: "monospace",
      fontSize: "0.85em",
    },
    [`.${background_class}.sl .${header_class}`]: {
      display: "none",
    },
    [`& .${lang_class}`]: {
      fontWeight: "500",
      color: "var(--cm-codeblock-lang-color, inherit)",
    },
    [`& .${path_class}`]: {
      color: "var(--cm-codeblock-path-color, inherit)",
      opacity: "var(--cm-codeblock-path-opacity, 0.6)",
    },
    [`.${background_class}:not(.sl) .${marking_class}`]: {
      opacity: "0",
    },
    [`.${background_class}:not(.sl) .${codeinfo_class}`]: {
      opacity: "0",
    },
    [`& .${boton_class}`]: {
      margin: padding_horizontal,
      padding: "0",
      display: "inline-flex",
      borderRadius: "999999px",
      background: "#00000020",
      border: "none",
      outline: "none",
      justifyContent: "center",
      alignItems: "center",
      height: `1lh`,
      width: "5ch",
      position: "relative",
    },
    [`& .${boton_class}::before`]: {
      content: "attr(data-state)",
      color: "currentColor",
      position: "absolute",
      top: "-100%",
    },
    [`&dark .${boton_class}::before`]: {
      color: "white",
    },
    "& .cb-icon": {
        height: "80%",
        pointerEvents: "none",
        fill: "currentColor",
        opacity: "0.7"
    },
    "&dark .cb-icon": {
        fill: "white",
    },
    [`& .${boton_class}:hover`]: {
      background: "#00000060",
    },
    [`& .${boton_class}:hover .cb-icon`]: {
        opacity: "0.9",
    },
    "@media print": {
      [`.${wrap_class}`]: {
        display: "none !important",
      },
      [`.${boton_class}`]: {
        display: "none !important",
        background: "none !important",
      },
      ".cb-icon": {
        display: "none !important",
      },
    },
  });
};
