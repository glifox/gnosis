import { PluginFactory } from "../../../utils";
import { mousedown } from "./copy/event";
import { decorator } from "./decorations";
import { coreTheme } from "./theme";


export type Options = {
  marginLeft: number;
  paddingLeft: number;
} 

export const code = () => {
    const options: Options = {
      marginLeft: 2,
      paddingLeft: 6,
    }
    return [
        PluginFactory(decorator, { mode: "mark"} ),
        PluginFactory(decorator, { mode: "type", options }, {eventHandlers: { mousedown }}),
        coreTheme(options),
    ]
};
