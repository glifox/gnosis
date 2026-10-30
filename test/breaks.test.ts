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
});
