import { languages } from "@codemirror/language-data";
import { markdown } from "@codemirror/lang-markdown"
import { GFM } from "@lezer/markdown"

import { unsetMarks } from "../src/tags";

import { HrPlugin } from "../src/plugins/block/hr/plugin";
import { inlinePlugin } from "../src/plugins/inline/plugin";
import { ListPlugin } from "../src/plugins/block/list/plugin";
import { CodePlugin } from "../src/plugins/block/code/plugin";
import { HeadingPlugin } from "../src/plugins/block/heading/plugin";

const gnosis = (conf = { markdown: {}}) => {
    const { 
        markdown: {
            defaultCodeLanguage,
            codeLanguages,
            addKeymap,
            base,
            completeHTMLTags,
            htmlTagLanguage,
            extensions = [],
        }, 
        inline, 
        Heading, 
        Hr, 
        List, 
        Code, 
    } = conf; 

    const mdconfig = {
        defaultCodeLanguage,
        codeLanguages: codeLanguages || languages,
        addKeymap,
        base,
        completeHTMLTags,
        htmlTagLanguage,
        extensions: [ ...extensions, GFM, unsetMarks ],
    }

    return [
        markdown(mdconfig),
        inlinePlugin(inline),
        HeadingPlugin(Heading),
        ListPlugin(List),
        HrPlugin(Hr),
        CodePlugin(Code),
    ]
}

export {
    gnosis,
    HrPlugin,
    inlinePlugin,
    ListPlugin,
    CodePlugin,
    HeadingPlugin,
};

export default gnosis;

if (typeof window !== 'undefined') { 
    window.gnosis = gnosis;
    window.gnosis = HrPlugin;
    window.ListPlugin = ListPlugin;
    window.CodePlugin = CodePlugin;
    window.inlinePlugin = inlinePlugin;
    window.HeadingPlugin = HeadingPlugin;
}
