import { test, expect } from '@playwright/test';

test.describe('Kiedy Wypłata E2E Tests', () => {
  
  test('should display homepage with payment information', async ({ page }) => {
    await page.goto('/');

    // Check main heading
    await expect(page.getByRole('heading', { name: /Kiedy Wypłata/ })).toBeVisible();

    // Check if next payment banner is visible
    await expect(page.locator('.next-payment-banner')).toBeVisible();

    // Check if payment cards are displayed
    const paymentCards = page.locator('.payment-card');
    await expect(paymentCards.first()).toBeVisible();

    // Verify 800+ payment card link (avoid getByText('800+') — matches many nodes)
    await expect(page.locator('a[href="/benefit/800plus"]')).toBeVisible();
  });

  test('should navigate to benefit detail page', async ({ page }) => {
    await page.goto('/');

    // Click on 800+ payment card
    await page.locator('a[href="/benefit/800plus"]').click();

    // Should navigate to benefit detail page
    await expect(page).toHaveURL(/\/benefit\/800plus/);
    
    // Check if benefit details are displayed (scope to main payout block — related cards also say „Następna wypłata”)
    await expect(page.getByRole('heading', { name: /800\+/ })).toBeVisible();
    await expect(
      page.locator('.benefit-page__payment-info').getByText(/Następna wypłata|Ostatnia wypłata/)
    ).toBeVisible();
  });

  test('should load programmatic benefit month page (SEO)', async ({ page }) => {
    await page.goto('/benefit/800plus/2026/3');

    await expect(page).toHaveURL(/\/benefit\/800plus\/2026\/3$/);
    await expect(page.getByRole('heading', { name: /800\+.*2026|marzec/i })).toBeVisible();
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://www.kiedywyplata.pl/benefit/800plus/2026/3');
  });

  test('should filter payments correctly by category', async ({ page }) => {
    await page.goto('/');

    // Navigate to family category
    await page.getByText('Świadczenia rodzinne').click();

    await expect(page).toHaveURL(/\/family/);
    
    // Should show family payments only
    await expect(page.locator('a[href="/benefit/800plus"]')).toBeVisible();
    await expect(page.locator('a[href="/benefit/zasilek-rodzinny"]')).toBeVisible();

    // Should not show pension payments (card title is „Emerytury i renty ZUS”, not „Emerytura ZUS”)
    await expect(page.locator('a[href="/benefit/emerytura"]')).not.toBeVisible();
  });

  test('should display excluded payments correctly', async ({ page }) => {
    await page.goto('/benefit/dobry-start');

    // Should show annual payment label
    await expect(page.getByText('Wypłata roczna:')).toBeVisible();

    // No countdown in the main payout block (related cards below may still show „za X dni”)
    await expect(page.locator('.benefit-page__payment-info')).not.toContainText(/za \d+ dni/);
    
    // Should show special note
    await expect(page.getByText('Świadczenie wypłacane raz w roku')).toBeVisible();
  });

  test('should handle theme switching', async ({ page }) => {
    await page.goto('/');

    // Check initial theme
    const themeToggle = page.getByRole('button', { name: /Przełącz na tryb/i });
    await expect(themeToggle).toBeVisible();

    // Click theme toggle
    await themeToggle.click();

    // Check if theme changed (data-theme attribute)
    await expect(page.locator('div[data-theme]')).toHaveAttribute('data-theme', /.+/);
  });

  test('should display footer with SEO link', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Check footer content
    await expect(page.getByText(/© \d{4} Kiedy Wypłata/)).toBeVisible();
    
    // Check SEO link
    const seoLink = page.getByRole('link', { name: 'Katalog SEO' });
    await expect(seoLink).toBeVisible();
    await expect(seoLink).toHaveAttribute('href', 'https://www.katalogseo.net.pl');
    await expect(seoLink).toHaveAttribute('target', '_blank');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if mobile layout works
    await expect(page.getByRole('heading', { name: /Kiedy Wypłata/ })).toBeVisible();
    await expect(page.locator('.payment-card').first()).toBeVisible();

    // Check if navigation works on mobile
    await page.getByText('Świadczenia rodzinne').click();
    await expect(page).toHaveURL(/\/family/);
  });

  test('should not inject AdSense slot on initial paint', async ({ page }) => {
    await page.goto('/');

    // No <ins class="adsbygoogle"> until LazyAdSense is mounted and script loads
    await expect(page.locator('ins.adsbygoogle')).toHaveCount(0);
  });

  test('should have correct SEO metadata', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Kiedy Wypłata.*Terminy wypłat/);

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /800\+.*ZUS.*zasiłk/);

    // Canonical for homepage (Next resolves metadataBase without trailing slash)
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /https:\/\/www\.kiedywyplata\.pl\/?$/);
  });

  test('subpage canonical points to itself, not homepage', async ({ page }) => {
    await page.goto('/benefits');
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://www.kiedywyplata.pl/benefits');
  });

  test('should handle payment date calculations correctly', async ({ page }) => {
    await page.goto('/');

    // Check if next payment banner shows a valid date
    const nextPaymentBanner = page.locator('.next-payment-banner');
    await expect(nextPaymentBanner).toBeVisible();

    // Should contain a valid date format
    await expect(nextPaymentBanner.getByText(/\d{1,2}\s+\w+\s+\d{4}/)).toBeVisible();

    // Should show countdown
    await expect(nextPaymentBanner.getByText(/za \d+|dziś|jutro/i)).toBeVisible();
  });
});