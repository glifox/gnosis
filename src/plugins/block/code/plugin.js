import { PluginFactory } from "../../common/factory";
import { decorator } from "./decorations";
import { coreTheme } from "./theme";


export const CodePlugin = (conf) => {
    
    return [
        PluginFactory(decorator, { mode: "mark"}),
        PluginFactory(decorator, { mode: "type"}),
        coreTheme(),
    ]
};
