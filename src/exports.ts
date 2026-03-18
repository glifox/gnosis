import { languages } from "@codemirror/language-data";
import { Language, LanguageSupport, LanguageDescription } from '@codemirror/language';
import { markdown as mrk } from "@codemirror/lang-markdown";
import { GFM, MarkdownExtension } from "@lezer/markdown";
import { Extension } from "@codemirror/state";

// import { catppuccin, themeVariant } from "./theme/catppuccin";

import { unsetMarks } from "../src/tags";
import { HrPlugin } from "../src/plugins/block/hr/plugin";
import { InlinePlugin } from "../src/plugins/inline/plugin";
import { LinkPlugin } from "./plugins/links/link/plugin";
import { ImagePlugin } from "./plugins/links/image/plugin";
import { ListPlugin } from "../src/plugins/block/list/plugin";
import { CodePlugin } from "../src/plugins/block/code/plugin";
import { HeadingPlugin } from "../src/plugins/block/heading/plugin";
import { QuotePlugin } from "./plugins/block/quotes/plugin";
import { QuoteType } from "./plugins/block/quotes/extension";
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
    markdown?: MarkdownConfig,
    // theme?: string
}

const IntrnalMarkdown = (config?: MarkdownConfig) => {
  const {
    defaultCodeLanguage,
    codeLanguages,
    addKeymap,
    base,
    completeHTMLTags,
    htmlTagLanguage,
    extensions = [],
  } = config || {};
  
  const mdconfig = {
      defaultCodeLanguage,
      codeLanguages: codeLanguages || languages,
      addKeymap,
      base,
      completeHTMLTags,
      htmlTagLanguage,
      extensions: [...extensions, GFM, QuoteType],
  };
  
  return mrk(mdconfig);
}

const gnosis = (conf?: GnosisConfig): Extension[] => {
    const {
        markdown,
        // theme
    } = conf ?? {};

    return [
        IntrnalMarkdown(markdown),
        HrPlugin(),
        InlinePlugin(),
        LinkPlugin(),
        ImagePlugin(),
        ListPlugin(),
        CodePlugin(),
        HeadingPlugin(),
        QuotePlugin(),
        HtmlPlugin(),
        // (theme) ? themeVariant.of(catppuccin(theme)) : [],
    ];
};

export {
    IntrnalMarkdown as markdown,
    gnosis,
    HrPlugin,
    InlinePlugin,
    LinkPlugin,
    ImagePlugin,
    ListPlugin,
    CodePlugin,
    HeadingPlugin,
    QuotePlugin,
    QuoteType,
    HtmlPlugin,
    unsetMarks,
};
