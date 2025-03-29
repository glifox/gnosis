import { PluginFactory } from "../../common/factory";
import { decorator } from "./decorations";
import { coreTheme } from "./theme";


export const QuotePlugin = (conf) => {
    
    return [
        PluginFactory(decorator, conf),
        coreTheme(),
    ]
};
