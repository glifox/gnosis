import { PluginFactory } from "../../../utils";
import { decorator } from "./decorations";
import { coreTheme } from "./theme";


export const quotes = () => {
  return [
    PluginFactory(decorator, null),
    coreTheme(),
  ];
};
