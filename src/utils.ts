import {
  ViewPlugin,
  ViewUpdate,
  type DecorationSet,
  type PluginSpec,
} from "@codemirror/view";
import type { EditorView } from "codemirror";
import { syntaxTree } from "@codemirror/language";
import type { IterMode, SyntaxNodeRef } from "@lezer/common";

export const hasSelection = (view: EditorView, from: number, to: number) => {
  const selections = view.state.selection.ranges;

  for (let range of selections) {
    if (
      (range.from >= from && range.from <= to) ||
      (range.to >= from && range.to <= to) ||
      (range.from <= from && range.to >= to)
    ) {
      return true;
    }
  }
  return false;
};

export const visibleNodes = (
  view: EditorView,
  iterator: {
    enter(node: SyntaxNodeRef): boolean | void;
    leave?(node: SyntaxNodeRef): void;
    mode?: IterMode;
  },
) => {
  for (const { from, to } of view.visibleRanges)
    syntaxTree(view.state).iterate({ ...iterator, from, to });
};

export const PluginFactory = <T extends any>(
  func: (view: EditorView, config: T) => DecorationSet,
  conf: T,
  pluginSpec?: PluginSpec<any>,
) => {
  const decorator = class Decorator {
    decorations: DecorationSet;
    conf: T;

    constructor(view: EditorView) {
      this.conf = conf;
      this.decorations = func(view, this.conf);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged || update.selectionSet)
        this.decorations = func(update.view, this.conf);
    }
  };

  return ViewPlugin.fromClass(decorator, {
    decorations: (v) => v.decorations,
    ...pluginSpec,
  });
};

export const startTimer = (oncomplete: () => void, duration: number) => {
  let timeoutId: number | null = null;
  const startTime = Date.now();
  
  const timeoutHandler = () => {
    if (Date.now() - startTime >= duration) {
      oncomplete();
      window.cancelAnimationFrame(timeoutId!);
    } else {
      timeoutId = requestAnimationFrame(timeoutHandler);
    }
  };

  timeoutId = requestAnimationFrame(timeoutHandler);
}
