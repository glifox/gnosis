import { PluginFactory } from "../../common/factory";
import { decorator } from "./decorations";
import { mousedown } from "./task/mousedown";
import { coreTheme } from "./theme";


export const ListPlugin = (conf = {}) => {

    return [
        PluginFactory(decorator, {}, {eventHandlers: { mousedown }}),
        coreTheme(conf?.color),
    ]
};
