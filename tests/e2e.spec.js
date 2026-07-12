const { test, expect } = require('@playwright/test');
const path = require('path');

const FILE_URL = `file://${path.resolve(__dirname, '../index.html')}`;

test.beforeEach(async ({ page }) => {
  await page.goto(FILE_URL);
});

test('nav links', async ({ page }) => {
  const hrefs = ['#research', '#education', '#publications', '#contact'];
  for (const href of hrefs) {
    const link = page.locator(`.side-nav a[href="${href}"]`);
    await expect(link).toHaveCount(1);
  }
});

test('github link', async ({ page }) => {
  const link = page.locator('#contact a[href="https://github.com/jensbremnes"]');
  await expect(link).toHaveCount(1);
});

test('contact section', async ({ page }) => {
  const section = page.locator('#contact');
  await expect(section).toBeVisible();
});

test('profile photo', async ({ page }) => {
  const img = page.locator('img[src*="jens_einar_bremnes_photo.jpg"]');
  await expect(img).toHaveCount(1);
  await expect(img).toBeVisible();
});

test('viewport 375px - no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(FILE_URL);
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  expect(overflow).toBe(false);
});

test('viewport 1280px - no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(FILE_URL);
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  expect(overflow).toBe(false);
});

test('publications count', async ({ page }) => {
  const pubs = page.locator('.pub-entry');
  const count = await pubs.count();
  expect(count).toBeGreaterThanOrEqual(16);
});

test('google scholar link', async ({ page }) => {
  const links = page.locator('a[href*="scholar.google.com"]');
  const count = await links.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test('citation stats hooks for update workflow', async ({ page }) => {
  await expect(page.locator('#stat-citations')).toHaveText(/^\d+$/);
  await expect(page.locator('#stat-hindex')).toHaveText(/^\d+$/);
});

test('theme toggle switches and persists', async ({ page }) => {
  const html = page.locator('html');
  await expect(html).not.toHaveAttribute('data-theme', 'dark');

  await page.locator('#theme-toggle').click();
  await expect(html).toHaveAttribute('data-theme', 'dark');

  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');

  await page.locator('#theme-toggle').click();
  await expect(html).not.toHaveAttribute('data-theme', 'dark');
});

test('publication sort by citations reorders entries', async ({ page }) => {
  await page.locator('#pub-sort-citations').click();
  const firstJournal = page.locator('#pub-list .pub-entry').first();
  await expect(firstJournal.locator('.pub-title')).toContainText(
    'A Bayesian approach to supervisory risk control'
  );
  await expect(page.locator('#pub-sort-citations')).toHaveAttribute('aria-pressed', 'true');
});
