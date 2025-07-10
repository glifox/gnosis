
import { PluginFactory } from "../common/factory";
import { decorator } from "./decorations";
import { coreTheme, InlineTheme } from "./theme";


export const InlinePlugin = () => {
    
    return [
        PluginFactory(decorator, {}),
        InlineTheme,
        coreTheme,
    ]
};
