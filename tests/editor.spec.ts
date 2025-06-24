import { test, expect } from '@playwright/test';

test('homepage renders login form', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/sign in/i)).toBeVisible();
});
