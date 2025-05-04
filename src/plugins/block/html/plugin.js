import { PluginFactory } from "../../common/factory";
import { decorator } from "./decorations";
// import { coreTheme } from "./theme";


export const HtmlPlugin = (conf = {}) => {

    return [
        PluginFactory(decorator, {}),
        // coreTheme,
    ]
};
