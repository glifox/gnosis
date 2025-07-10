import { PluginFactory } from "../../common/factory";
import { mousedown } from "./copy/event";
import { decorator } from "./decorations";
import { coreTheme } from "./theme";


export const CodePlugin = () => {
    
    return [
        PluginFactory(decorator, { mode: "mark"}),
        PluginFactory(decorator, { mode: "type"}, {eventHandlers: { mousedown }}),
        coreTheme(),
    ]
};
