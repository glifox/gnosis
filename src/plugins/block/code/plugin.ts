import { EditorView } from "codemirror";
import { PluginFactory } from "../../../utils";
import { decorator, provide } from "./decorator";
import { scrollHandler } from "./scroller";
import { coreTheme } from "./theme";
import { mousedown } from "./html/copy/event";


export const code = () => {
  return [
    PluginFactory(decorator, null, { provide, eventHandlers: { mousedown } }),
    coreTheme(),
    scrollHandler,
    // EditorView.theme({
    //   ".cm-scroller": {
    //     overflowX: "hidden !important",
    //   },
    //   ".cm-codeblock-wrapper": {
    //     overflowX: "auto",
    //   },
    // })
  ];
};
