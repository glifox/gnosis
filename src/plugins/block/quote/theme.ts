import { EditorView } from "codemirror";

type StyleSpec = { [key: string]: string }

export type Color = {
  light: string;
  dark: string;
};

export type BlockQuoteKind =
  | 'none'
  | 'note'
  | 'tip'
  | 'warning'
  | 'important'
  | 'caution';

export type BlockQuoteColors = Record<BlockQuoteKind, string | Color>;

const normalize = (color: string | Color): Color => {
  return typeof color === 'string' ? { light: color, dark: color } : color;
};

export const coreTheme = (
  colors: BlockQuoteColors = {
    none: 'black',
    note: 'blue',
    tip: 'green',
    warning: 'coral',
    important: 'rebeccapurple',
    caution: 'red',
  }
) => {
  
  const theme = {} as Record<string, StyleSpec>;

  for (const key in colors) {
    const kind = key as BlockQuoteKind;

    theme[`&light .quote-${kind}-mark, &light .cm-icon-${kind}, &light .quote-${kind}-mark`] = {
      color: normalize(colors[kind]).light,
    }
    
    theme[`&dark .quote-${kind}-mark, &dark .cm-icon-${kind}, &dark .quote-${kind}-mark`] = {
      color: normalize(colors[kind]).dark,
    }
  }
  
  return EditorView.baseTheme({
    ...theme,
    "& .quote-kind-marker": { opacity: '0.2' },
    "&.cm-focused .quote-kind-marker.selected": { opacity: '1' },
  })
}

