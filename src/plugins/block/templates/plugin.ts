import { PluginFactory } from "../../../utils";
import { decorator } from "./decorator";


export const template = () => {
  return [
    PluginFactory(decorator, null)
  ];
};
