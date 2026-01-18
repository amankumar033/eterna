import { test, expect } from '@playwright/test';

test('Axiom Pulse table visual regression', async ({ page }) => {
  await page.goto('http://localhost:3000/pulse');

  await expect(page).toHaveScreenshot('pulse-table.png', {
    maxDiffPixelRatio: 0.01, // ≈ ≤2px tolerance
  });
});
