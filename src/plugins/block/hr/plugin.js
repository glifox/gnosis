import { PluginFactory } from "../../common/factory";
import { decorator } from "./decorations";
import { coreTheme } from "./theme";


export const HrPlugin = (conf = {}) => {

    return [
        PluginFactory(decorator, {}),
        coreTheme(conf?.color),
    ]
};
