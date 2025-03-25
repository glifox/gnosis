
import { PluginFactory } from "../../common/factory";
import { decorator } from "./decorations";
import { mousedown } from "./events";
import { coreTheme } from "./theme";


export const ImagePlugin = (conf = {}) => {

    const { 
        hideMarks = true 
    } = conf;

    return [
        PluginFactory(decorator, {}, { eventHandlers: {  mousedown }}),
        coreTheme
    ]
};
