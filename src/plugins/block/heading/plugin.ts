import { PluginFactory } from "../../../utils";
import { decorator } from "./decorator";
import { core } from "./theme";


export const headings = () => {
  return [
    PluginFactory(decorator, null),
    core(),
  ];
};
