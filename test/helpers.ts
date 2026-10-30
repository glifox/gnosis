import type { Page } from '@playwright/test';

/**
 * Reset document content and place cursor at cursorOffset
 */
export async function setDoc(page: Page, text: string, cursorOffset: number = 0) {
  await page.evaluate(({ text, cursorOffset }) => {
    const view = (window as any).editor;
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: text },
      selection: { anchor: cursorOffset }
    });
    view.focus();
  }, { text, cursorOffset });
}

/**
 * Retrieve current document content as string
 */
export async function getDoc(page: Page): Promise<string> {
  return await page.evaluate(() => {
    const view = (window as any).editor;
    return view.state.doc.toString();
  });
}

/**
 * Retrieve current cursor position, line number (1-based), and column
 */
export async function getCursor(page: Page) {
  return await page.evaluate(() => {
    const view = (window as any).editor;
    const pos = view.state.selection.main.head;
    const line = view.state.doc.lineAt(pos);
    return {
      pos,
      lineNumber: line.number,
      column: pos - line.from,
    };
  });
}

/**
 * Move cursor to a specific line and column
 */
export async function setCursor(page: Page, lineNumber: number, column: number = 0) {
  await page.evaluate(({ lineNumber, column }) => {
    const view = (window as any).editor;
    const line = view.state.doc.line(lineNumber);
    const targetPos = Math.min(line.from + column, line.to);
    view.dispatch({
      selection: { anchor: targetPos }
    });
    view.focus();
  }, { lineNumber, column });
}
