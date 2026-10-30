import { test, expect } from '@playwright/test';
import { setDoc } from './helpers';

test.describe('Codeblocks Decorator & Widgets', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.locator('.cm-content').waitFor({ state: 'visible' });
  });

  test('render code block container and copy widget', async ({ page }) => {
    const doc = [
      'Preceding text',
      '```javascript',
      'const a = 1;',
      'const b = 2;',
      '```',
      'Following text'
    ].join('\n');

    await setDoc(page, doc, 0);

    // Codeblock scroller container
    const scroller = page.locator('.cm-codeblock-scroller');
    await expect(scroller).toBeVisible();

    // Copy button widget
    const copyWidget = page.locator('.cm-widget-copy-codeblock-btn');
    await expect(copyWidget).toBeVisible();
  });

  test('hide copy button when selecting text within code block', async ({ page }) => {
    const doc = [
      '```ts',
      'const greeting = "hello";',
      '```'
    ].join('\n');

    await setDoc(page, doc, 0);

    const copyBtn = page.locator('.cm-widget-copy-codeblock-btn');
    await expect(copyBtn).toBeVisible();

    // Select text within the codeblock
    await page.evaluate(() => {
      const view = (window as any).editor;
      view.dispatch({
        selection: { anchor: 10, head: 24 }
      });
    });

    // The background container receives the '.sl' (selected) class
    await expect(page.locator('.cm-codeblock-background.sl')).toBeVisible();

    // The copy widget is hidden via CSS rules (width/height 0 or overflow hidden)
    const wrap = page.locator('.cm-codeblock-background.sl .cm-widget-copy-codeblock');
    const isHidden = await wrap.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.overflow === 'hidden' || style.width === '0px' || style.display === 'none';
    });
    expect(isHidden).toBe(true);
  });

  test('hide copy button, icon, and background in print mode', async ({ page }) => {
    const doc = [
      'Text outside',
      '```ts',
      'console.log("print preview");',
      '```',
      'Trailing text'
    ].join('\n');

    await setDoc(page, doc, 0);

    const copyBtn = page.locator('.cm-widget-copy-codeblock-btn');
    await expect(copyBtn).toBeVisible();

    // Emulate print media
    await page.emulateMedia({ media: 'print' });

    const wrap = page.locator('.cm-widget-copy-codeblock');
    const isHidden = await wrap.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.display === 'none';
    });
    expect(isHidden).toBe(true);
  });

  test('gracefully handle unclosed code block at end of file (EOF)', async ({ page }) => {
    // Unclosed fence at EOF
    const doc = '```typescript\nlet x = 10;';
    await setDoc(page, doc, 0);

    // Should not throw errors and must keep the scroller active
    const scroller = page.locator('.cm-codeblock-scroller');
    await expect(scroller).toBeVisible();
  });
});
