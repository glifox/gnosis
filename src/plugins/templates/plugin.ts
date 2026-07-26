import { PluginFactory } from "../../../utils";
import { decorator } from "./decorator";


export const quotes = () => {
  return [
    PluginFactory(decorator, null)
  ];
};
