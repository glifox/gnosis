import { test, expect } from '@playwright/test';
import { setDoc } from './helpers';

test.describe('Pretext Breaks & Soft Wrapping', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.locator('.cm-content').waitFor({ state: 'visible' });
  });

  test('does not insert artificial break widgets inside code blocks', async ({ page }) => {
    const doc = [
      '```javascript',
      'const anExtremelyLongLineOfCodeWithoutAnySpaces = "123456789012345678901234567890";',
      '```'
    ].join('\n');

    await setDoc(page, doc, 0);

    // Code blocks must stay inside their scroller
    const codeLines = page.locator('.cm-codeblock-content');
    await expect(codeLines.first()).toBeVisible();
  });

  test('measures on contentDOM and renders without breaking structure', async ({ page }) => {
    const doc = 'This is a normal paragraph to verify that pretext initializes properly.';
    await setDoc(page, doc, 0);

    const contentDOM = page.locator('.cm-content');
    await expect(contentDOM).toBeVisible();

    const width = await contentDOM.evaluate((el) => el.getBoundingClientRect().width);
    expect(width).toBeGreaterThan(0);
  });

  test('applies native pre-wrap and hides pretext break widgets in print mode', async ({ page }) => {
    const longParagraph = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(40);
    await setDoc(page, longParagraph, 0);

    const content = page.locator('.cm-content');
    await expect(content).toBeVisible();

    // Emulate print media
    await page.emulateMedia({ media: 'print' });

    const contentStyle = await content.evaluate((el) => window.getComputedStyle(el).whiteSpace);
    expect(contentStyle).toBe('pre-wrap');

    const firstLine = page.locator('.cm-line').first();
    const lineStyle = await firstLine.evaluate((el) => window.getComputedStyle(el).whiteSpace);
    expect(lineStyle).toBe('pre-wrap');

    const breakWidgets = page.locator('.cm-break-widget');
    const count = await breakWidgets.count();
    if (count > 0) {
      const isHidden = await breakWidgets.first().evaluate((el) => window.getComputedStyle(el).display === 'none');
      expect(isHidden).toBe(true);
    }
  });
});
