import { test, expect } from '@playwright/test';
import { setDoc, getDoc, setCursor } from './helpers';

test.describe('Task Lists & Checkbox Interactivity', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.locator('.cm-content').waitFor({ state: 'visible' });
  });

  test('render interactive checkbox for task list items', async ({ page }) => {
    const doc = [
      '- [ ] Pending task',
      '- [x] Completed task'
    ].join('\n');

    await setDoc(page, doc, 0);

    const checkboxes = page.locator('.cm-taskmark input[type="checkbox"]');
    await expect(checkboxes).toHaveCount(2);

    expect(await checkboxes.nth(0).isChecked()).toBe(false);
    expect(await checkboxes.nth(1).isChecked()).toBe(true);
  });

  test('checkbox toggle on click updates underlying document', async ({ page }) => {
    const doc = '- [ ] Interactive task';
    await setDoc(page, doc, 0);

    const checkbox = page.locator('.cm-taskmark input[type="checkbox"]').first();
    await expect(checkbox).toBeVisible();
    expect(await checkbox.isChecked()).toBe(false);

    // Click checkbox to check
    await checkbox.click();

    // Document in CodeMirror should update to [x]
    const updatedDoc = await getDoc(page);
    expect(updatedDoc).toContain('- [x] Interactive task');

    // Click checkbox again to uncheck
    await checkbox.click();
    const revertedDoc = await getDoc(page);
    expect(revertedDoc).toContain('- [ ] Interactive task');
  });

  test('render cm-widget-bullet, extract color from child span and toggle visibility on selection', async ({ page }) => {
    const doc = '- Bullet item';
    // Cursor at the end so bullet mark is not selected
    await setDoc(page, doc, doc.length);

    const bullet = page.locator('cm-widget-bullet');
    await expect(bullet).toHaveCount(1);
    await expect(bullet).not.toHaveClass(/mk-show/);

    // Any children inside bullet are hidden when unselected
    const isChildHidden = await bullet.evaluate((el) => {
      const child = el.querySelector('*') || el;
      return window.getComputedStyle(child).visibility === 'hidden';
    });
    expect(isChildHidden).toBe(true);

    // Background color of bullet matches the child span syntax color
    const { bulletBg, childColor } = await bullet.evaluate((el) => {
      const child = el.querySelector('*') || el;
      return {
        bulletBg: el.style.getPropertyValue('--cm-bullet-bg'),
        childColor: window.getComputedStyle(child).color,
      };
    });
    expect(bulletBg).toBeTruthy();
    expect(bulletBg).toBe(childColor);

    // Place cursor directly on the bullet marker at offset 0
    await setCursor(page, 1, 0);
    await expect(bullet).toHaveClass(/mk-show/);

    // When selected, text / child becomes visible
    const isChildVisible = await bullet.evaluate((el) => {
      const child = el.querySelector('*') || el;
      return window.getComputedStyle(child).visibility === 'visible';
    });
    expect(isChildVisible).toBe(true);

    // And bullet dot is hidden
    const isBulletHidden = await bullet.evaluate((el) => {
      return window.getComputedStyle(el, '::before').display === 'none';
    });
    expect(isBulletHidden).toBe(true);

    // Move cursor back to end of line
    await setCursor(page, 1, doc.length);
    await expect(bullet).not.toHaveClass(/mk-show/);
  });
});
