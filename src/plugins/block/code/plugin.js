import { PluginFactory } from "../../common/factory";
import { mousedown } from "./copy/event";
import { decorator } from "./decorations";
import { coreTheme } from "./theme";


export const CodePlugin = () => {
    const options = {
      marginLeft: 2,
      paddingLeft: 6,
    }
    return [
        PluginFactory(decorator, { mode: "mark"}),
        PluginFactory(decorator, { mode: "type", options }, {eventHandlers: { mousedown }}),
        coreTheme(options),
    ]
};
