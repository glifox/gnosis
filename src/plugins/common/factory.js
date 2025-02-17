import {ViewPlugin} from "@codemirror/view";

export const PluginFactory = (func, conf, pluginSpec = {}) =>  {
    const decorator = class Decorator {
        decorations;
        conf;

        constructor(view) {
            this.conf = conf;
            this.decorations = func(view, this.conf);
        }

        update(update) {
            if (
                update.docChanged ||
                update.viewportChanged ||
                update.selectionSet
            ) this.decorations = func(update.view, this.conf);
        }
    }

    return ViewPlugin.fromClass(decorator, { decorations: (v) => v.decorations, ...pluginSpec })
}