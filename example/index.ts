import { Editor } from "./editor";

const view = Editor(``, false, `[gnosis:example]`);
(window as any).editor = view;
