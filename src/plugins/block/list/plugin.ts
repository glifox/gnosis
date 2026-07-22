import { PluginFactory } from "../../../utils";
import { decorator } from "./decorations";
import { mousedown } from "./event";
// import { mousedown } from "./task/mousedown";
import { coreTheme } from "./theme";


export const ListPlugin = () => {

    return [
        PluginFactory(decorator, {}, {eventHandlers: { mousedown }} ),
        coreTheme(),
    ]
};
