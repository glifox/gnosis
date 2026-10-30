import { test, expect } from '@playwright/test';
import { setDoc, setCursor } from './helpers';

test.describe('Headings Decorator & Theme', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.locator('.cm-content').waitFor({ state: 'visible' });
  });

  test('correct rendering of heading levels H1 through H6', async ({ page }) => {
    const doc = [
      '# Heading 1',
      '## Heading 2',
      '### Heading 3',
      '#### Heading 4',
      '##### Heading 5',
      '###### Heading 6',
      'Regular paragraph'
    ].join('\n');

    await setDoc(page, doc, 0);

    // Verify each heading level class is applied
    await expect(page.locator('.cm-heading1')).toBeVisible();
    await expect(page.locator('.cm-heading2')).toBeVisible();
    await expect(page.locator('.cm-heading3')).toBeVisible();
    await expect(page.locator('.cm-heading4')).toBeVisible();
    await expect(page.locator('.cm-heading5')).toBeVisible();
    await expect(page.locator('.cm-heading6')).toBeVisible();

    // Regular paragraph should not have heading classes
    const lines = page.locator('.cm-line');
    const lastLine = lines.nth(6);
    await expect(lastLine).not.toHaveClass(/cm-heading/);
  });

  test('hide "#" marks when cursor is on another line and reveal on line entry', async ({ page }) => {
    const doc = '# Main Title\nSecond paragraph text';
    await setDoc(page, doc, 0);

    // Move cursor to the second line
    await setCursor(page, 2, 0);

    // When cursor is outside the heading line, it shouldn't have the '.sel' class
    const headingLine = page.locator('.cm-line.cm-heading1');
    await expect(headingLine.locator('.sel')).toHaveCount(0);

    // Move cursor inside the heading line
    await setCursor(page, 1, 5);

    // Upon entry, it receives '.sel' to reveal the `#` marks
    await expect(headingLine.locator('.sel')).toHaveCount(1);
  });

  test('vertical alignment of gutter with large headings', async ({ page }) => {
    const doc = '# Very Large Title\nRegular line';
    await setDoc(page, doc, 0);

    const firstLineNumber = page.locator('.cm-lineNumbers .cm-gutterElement').filter({ hasText: '1' });
    await expect(firstLineNumber).toBeVisible();

    // Verify gutter element uses display: flex for proper vertical centering
    const displayStyle = await firstLineNumber.evaluate((el) => window.getComputedStyle(el).display);
    expect(displayStyle).toBe('flex');
  });
});
