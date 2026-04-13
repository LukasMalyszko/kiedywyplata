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

    // Verify 800+ payment is present
    await expect(page.getByText('800+')).toBeVisible();
  });

  test('should navigate to benefit detail page', async ({ page }) => {
    await page.goto('/');

    // Click on 800+ payment card
    await page.getByText('800+').first().click();

    // Should navigate to benefit detail page
    await expect(page).toHaveURL(/\/benefit\/800plus/);
    
    // Check if benefit details are displayed
    await expect(page.getByRole('heading', { name: /800\+/ })).toBeVisible();
    await expect(page.getByText(/Następna wypłata|Ostatnia wypłata/)).toBeVisible();
  });

  test('should filter payments correctly by category', async ({ page }) => {
    await page.goto('/');

    // Navigate to family category
    await page.getByText('Świadczenia rodzinne').click();

    await expect(page).toHaveURL(/\/family/);
    
    // Should show family payments only
    await expect(page.getByText('800+')).toBeVisible();
    await expect(page.getByText('Zasiłek rodzinny')).toBeVisible();
    
    // Should not show pension payments
    await expect(page.getByText('Emerytura ZUS')).not.toBeVisible();
  });

  test('should display excluded payments correctly', async ({ page }) => {
    await page.goto('/benefit/dobry-start');

    // Should show annual payment label
    await expect(page.getByText('Wypłata roczna:')).toBeVisible();
    
    // Should not show countdown
    await expect(page.getByText(/za \d+ dni/)).not.toBeVisible();
    
    // Should show special note
    await expect(page.getByText('Świadczenie wypłacane raz w roku')).toBeVisible();
  });

  test('should handle theme switching', async ({ page }) => {
    await page.goto('/');

    // Check initial theme
    const themeToggle = page.getByRole('button', { name: /przełącz motyw/i });
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
    await expect(page.locator('.payment-card')).toBeVisible();

    // Check if navigation works on mobile
    await page.getByText('Świadczenia rodzinne').click();
    await expect(page).toHaveURL(/\/family/);
  });

  test('should load AdSense lazily after user interaction', async ({ page }) => {
    await page.goto('/');

    // Initially AdSense should not be loaded
    await expect(page.locator('ins.adsbygoogle')).not.toBeVisible();

    // Scroll down to trigger lazy loading
    await page.mouse.move(100, 100);
    await page.mouse.click(100, 100);

    // Wait a bit for lazy loading
    await page.waitForTimeout(4000);

    // AdSense should now be present (but may not be visible due to ad blockers)
    await expect(page.locator('.lazy-adsense')).toBeVisible();
  });

  test('should have correct SEO metadata', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Kiedy Wypłata.*Terminy wypłat/);

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /800\+.*ZUS.*zasiłk/);

    // Check canonical link (must match this URL, not always homepage)
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://www.kiedywyplata.pl/');
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