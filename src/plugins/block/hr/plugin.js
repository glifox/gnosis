import { PluginFactory } from "../../common/factory";
import { decorator } from "./decorations";
import { coreTheme } from "./theme";


export const HrPlugin = () => {

    return [
        PluginFactory(decorator, {}),
        coreTheme(),
    ]
};
