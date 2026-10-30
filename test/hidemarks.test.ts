import { test, expect } from '@playwright/test';
import { setDoc, getCursor, setCursor } from './helpers';

test.describe('Hidemarks & Cursor Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.locator('.cm-content').waitFor({ state: 'visible' });
  });

  test('vertical cursor navigation between empty lines', async ({ page }) => {
    // Line 1: empty
    // Line 2: **content**
    // Line 3: empty
    const doc = '\n**content**\n';
    await setDoc(page, doc, 0);

    // Place cursor on line 3 (trailing empty line)
    await setCursor(page, 3, 0);
    const startCursor = await getCursor(page);
    expect(startCursor.lineNumber).toBe(3);

    // Press ArrowUp
    await page.keyboard.press('ArrowUp');

    // Cursor should land on line 2, without jumping straight to line 1
    const finalCursor = await getCursor(page);
    expect(finalCursor.lineNumber).toBe(2);
  });

  test('reveal marks when cursor enters and hide when cursor leaves', async ({ page }) => {
    const doc = 'Text with **bold** here';
    await setDoc(page, doc, 0);

    // Cursor at document start: outside of **bold**
    const selMarks = page.locator('.cm-line .sel');
    await expect(selMarks).toHaveCount(0);

    // Move cursor inside "bold" (approx offset 13)
    await setDoc(page, doc, 13);

    // The '.sel' decoration should now be present to reveal the marks
    await expect(page.locator('.cm-line .sel')).toHaveCount(1);

    // Move cursor to the end of the line (outside of bold)
    await page.keyboard.press('End');
    await expect(page.locator('.cm-line .sel')).toHaveCount(0);
  });

  test('continuous horizontal navigation (ArrowRight)', async ({ page }) => {
    const doc = 'a **bc** d';
    await setDoc(page, doc, 0);

    // Step through characters with ArrowRight and ensure cursor position strictly advances
    let lastPos = (await getCursor(page)).pos;
    for (let i = 0; i < 7; i++) {
      await page.keyboard.press('ArrowRight');
      const currentPos = (await getCursor(page)).pos;
      expect(currentPos).toBeGreaterThan(lastPos);
      lastPos = currentPos;
    }
  });

  test('text selection spanning hidden marks', async ({ page }) => {
    const doc = 'Before **highlighted** after';
    await setDoc(page, doc, 0);

    // Create a selection spanning "**highlighted**"
    await page.evaluate(() => {
      const view = (window as any).editor;
      view.dispatch({
        selection: { anchor: 7, head: 22 }
      });
    });

    const hasSelection = await page.evaluate(() => {
      const view = (window as any).editor;
      return !view.state.selection.main.empty;
    });
    expect(hasSelection).toBe(true);

    // When selected, the marks receive the '.sel' class
    await expect(page.locator('.cm-line .sel')).toHaveCount(1);
  });
});
