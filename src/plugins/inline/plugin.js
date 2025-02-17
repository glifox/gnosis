
import { PluginFactory } from "../common/factory";
import { decorator } from "./decorations";
import { coreTheme, inlineTheme } from "./theme";


export const inlinePlugin = (conf = {}) => {

    const { 
        hideMarks = true 
    } = conf;

    return [
        PluginFactory(decorator, {}),
        inlineTheme,
        hideMarks ? coreTheme : [],
    ]
};
