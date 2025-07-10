import { PluginFactory } from "../../common/factory";
import { decorator } from "./decorations";
import { coreTheme } from "./theme";


export const QuotePlugin = () => {
    
    return [
        PluginFactory(decorator, {}),
        coreTheme(),
    ]
};
