
import { PluginFactory } from "../../common/factory";
import { decorator } from "./decorations";
import { mousedown } from "./events";
import { coreTheme } from "./theme";


export const LinkPlugin = () => {
    return [
        PluginFactory(decorator, {},{eventHandlers: { mousedown }}),
        coreTheme,
    ]
};
