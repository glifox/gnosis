import { PluginFactory } from "../../common/factory";
import { decorator } from "./decorations";
import { coreTheme, headingTheme } from "./theme";


export const HeadingPlugin = () => {

    return [
        PluginFactory(decorator, {}),
        headingTheme,
        coreTheme,
    ]
};
