import { languages } from "@codemirror/language-data";
import { Language, LanguageSupport, LanguageDescription } from '@codemirror/language';
import { markdown } from "@codemirror/lang-markdown";
import { GFM, MarkdownExtension } from "@lezer/markdown";
import { Extension } from "@codemirror/state";

// import { catppuccin, themeVariant } from "./theme/catppuccin";

import { unsetMarks } from "../src/tags";
import { HrPlugin } from "../src/plugins/block/hr/plugin";
import { InlinePlugin } from "../src/plugins/inline/plugin";
import { ListPlugin } from "../src/plugins/block/list/plugin";
import { CodePlugin } from "../src/plugins/block/code/plugin";
import { HeadingPlugin } from "../src/plugins/block/heading/plugin";
import { QuotePlugin } from "./plugins/block/quotes/plugin";
import { QuoteType } from "./plugins/block/quotes/extension";
import { LinkPlugin } from "./plugins/links/link/plugin";
import { ImagePlugin } from "./plugins/links/image/plugin";
import { HtmlPlugin } from "./plugins/block/html/plugin";


interface MarkdownConfig {
    defaultCodeLanguage?: Language | LanguageSupport;
    codeLanguages?: readonly LanguageDescription[] | ((info: string) => Language | LanguageDescription | null);
    addKeymap?: boolean;
    extensions?: MarkdownExtension[];
    base?: Language;
    completeHTMLTags?: boolean;
    htmlTagLanguage?: LanguageSupport;
}

interface GnosisConfig {
    markdown: MarkdownConfig,
    // theme?: string
}

const gnosis = (conf?: GnosisConfig): Extension[] => {
    const {
        markdown: {
            defaultCodeLanguage,
            codeLanguages,
            addKeymap,
            base,
            completeHTMLTags,
            htmlTagLanguage,
            extensions = [],
        } = {},
        // theme
    } = conf ?? {};

    const mdconfig = {
        defaultCodeLanguage,
        codeLanguages: codeLanguages || languages,
        addKeymap,
        base,
        completeHTMLTags,
        htmlTagLanguage,
        extensions: [...extensions, GFM, unsetMarks, QuoteType],
    };

    return [
        markdown(mdconfig),
        HrPlugin(),
        InlinePlugin(),
        ListPlugin(),
        CodePlugin(),
        HeadingPlugin(),
        LinkPlugin(),
        QuotePlugin(),
        ImagePlugin(),
        HtmlPlugin(),
        // (theme) ? themeVariant.of(catppuccin(theme)) : [],
    ];
};

export {
    gnosis,
    HrPlugin,
    InlinePlugin,
    ListPlugin,
    CodePlugin,
    HeadingPlugin,
    LinkPlugin,
    QuotePlugin,
    QuoteType,
    ImagePlugin,
    HtmlPlugin,
    // catppuccin,
    // themeVariant,
};


declare global {
    interface Window {
        gnosis: typeof gnosis;
        HrPlugin: typeof HrPlugin;
        InlinePlugin: typeof InlinePlugin;
        ListPlugin: typeof ListPlugin;
        CodePlugin: typeof CodePlugin;
        HeadingPlugin: typeof HeadingPlugin;
        LinkPlugin: typeof LinkPlugin;
        QuotePlugin: typeof QuotePlugin;
        QuoteType: typeof QuoteType;
        ImagePlugin: typeof ImagePlugin;
        HtmlPlugin: typeof HtmlPlugin;
    }
}

if (typeof window !== 'undefined') {
    window.gnosis = gnosis;
    window.HrPlugin = HrPlugin;
    window.InlinePlugin = InlinePlugin;
    window.ListPlugin = ListPlugin;
    window.CodePlugin = CodePlugin;
    window.HeadingPlugin = HeadingPlugin;
    window.LinkPlugin = LinkPlugin;
    window.QuotePlugin = QuotePlugin;
    window.QuoteType = QuoteType;
    window.ImagePlugin = ImagePlugin;
    window.HtmlPlugin = HtmlPlugin;
}