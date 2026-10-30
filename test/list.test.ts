import { test, expect } from '@playwright/test';
import { setDoc, getDoc } from './helpers';

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
});
