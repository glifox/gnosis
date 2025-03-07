
import { PluginFactory } from "../common/factory";
import { decorator } from "./decorations";
import { coreTheme, InlineTheme } from "./theme";


export const InlinePlugin = (conf = {}) => {

    const { 
        hideMarks = true 
    } = conf;

    return [
        PluginFactory(decorator, {}),
        InlineTheme,
        hideMarks ? coreTheme : [],
    ]
};
