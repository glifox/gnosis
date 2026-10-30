import { test, expect } from '@playwright/test';
import { setDoc, setCursor } from './helpers';

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

  test('display centered language and dimmed path when cursor is outside, hide fences', async ({ page }) => {
    const doc = [
      'Outside top',
      '```ts:src/app.ts',
      'const a = 1;',
      '```',
      'Outside bottom'
    ].join('\n');

    // Place cursor outside the codeblock (line 1)
    await setDoc(page, doc, 0);

    const header = page.locator('.cm-codeblock-header');
    await expect(header).toBeVisible();

    const lang = page.locator('.cm-codeblock-lang');
    await expect(lang).toHaveText('ts');

    const path = page.locator('.cm-codeblock-path');
    await expect(path).toHaveText('src/app.ts');

    // Path has reduced opacity
    const pathOpacity = await path.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(Number(pathOpacity)).toBeLessThanOrEqual(0.7);

    // Opening and closing marks are hidden (opacity 0)
    const markings = page.locator('.cm-codeblock-marking');
    const codeinfo = page.locator('.cm-codeblock-codeinfo');
    expect(await markings.first().evaluate((el) => window.getComputedStyle(el).opacity)).toBe('0');
    expect(await codeinfo.evaluate((el) => window.getComputedStyle(el).opacity)).toBe('0');

    // Now place cursor inside codeblock (line 3)
    await setCursor(page, 3, 2);

    // Header should disappear and marks become visible
    await expect(header).not.toBeVisible();
    expect(await markings.first().evaluate((el) => window.getComputedStyle(el).opacity)).toBe('1');
    expect(await codeinfo.evaluate((el) => window.getComputedStyle(el).opacity)).toBe('1');
  });

  test('header and copy button remain stationary during horizontal scroll', async ({ page }) => {
    const longLine = 'const long = "' + 'x'.repeat(400) + '";';
    const doc = [
      'Outside',
      '```ts:utils.ts',
      longLine,
      '```',
      'Outside end'
    ].join('\n');

    await setDoc(page, doc, 0);

    const header = page.locator('.cm-codeblock-header');
    const copy = page.locator('.cm-widget-copy-codeblock');
    await expect(header).toBeVisible();
    await expect(copy).toBeVisible();

    const headerXBefore = await header.evaluate((el) => el.getBoundingClientRect().x);
    const copyXBefore = await copy.evaluate((el) => el.getBoundingClientRect().x);

    // Scroll horizontally in code-scroller
    await page.evaluate(async () => {
      const scroller = document.querySelector('.cm-codeblock-scroller') as HTMLElement;
      scroller.scrollLeft = 200;
      scroller.dispatchEvent(new Event('scroll'));
      await new Promise(r => requestAnimationFrame(r));
    });

    const headerXAfter = await header.evaluate((el) => el.getBoundingClientRect().x);
    const copyXAfter = await copy.evaluate((el) => el.getBoundingClientRect().x);

    expect(Math.abs(headerXBefore - headerXAfter)).toBeLessThan(1);
    expect(Math.abs(copyXBefore - copyXAfter)).toBeLessThan(1);
  });
});
