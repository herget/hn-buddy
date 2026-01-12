import { test, expect } from '@playwright/test';

test.describe('Signup Button Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show Subscribe button in header', async ({ page }) => {
    const subscribeButton = page.locator('#openSignupModal');
    await expect(subscribeButton).toBeVisible();
    await expect(subscribeButton).toHaveText('Subscribe');
    await page.screenshot({ path: 'test-results/01-subscribe-button.png', fullPage: true });
  });

  test('should open modal when Subscribe button is clicked', async ({ page }) => {
    const subscribeButton = page.locator('#openSignupModal');
    const modal = page.locator('#signupModal');

    // Modal should be hidden initially
    await expect(modal).toHaveAttribute('aria-hidden', 'true');

    // Click Subscribe button
    await subscribeButton.click();

    // Modal should now be visible
    await expect(modal).toHaveClass(/open/);
    await expect(modal).toHaveAttribute('aria-hidden', 'false');
    await page.screenshot({ path: 'test-results/02-modal-open.png', fullPage: true });
  });

  test('should show form elements in modal', async ({ page }) => {
    await page.locator('#openSignupModal').click();

    // Check form elements are visible
    await expect(page.locator('#modalTitle')).toHaveText('Subscribe to the HN Buddy Daily Digest');
    await expect(page.locator('label[for="email"]')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#submitButton')).toBeVisible();
    await expect(page.locator('.privacy-note')).toBeVisible();
    await page.screenshot({ path: 'test-results/03-form-elements.png', fullPage: true });
  });

  test('should show Turnstile widget container in modal', async ({ page }) => {
    await page.locator('#openSignupModal').click();

    // Turnstile container should be visible
    const turnstileContainer = page.locator('.cf-turnstile');
    await expect(turnstileContainer).toBeVisible();
    await page.screenshot({ path: 'test-results/04-turnstile-container.png', fullPage: true });
  });

  test('should close modal when X button is clicked', async ({ page }) => {
    const modal = page.locator('#signupModal');

    // Open modal
    await page.locator('#openSignupModal').click();
    await expect(modal).toHaveClass(/open/);

    // Click close button
    await page.locator('#closeModal').click();

    // Modal should be hidden
    await expect(modal).not.toHaveClass(/open/);
    await expect(modal).toHaveAttribute('aria-hidden', 'true');
    await page.screenshot({ path: 'test-results/05-modal-closed.png', fullPage: true });
  });

  test('should close modal when clicking outside', async ({ page }) => {
    const modal = page.locator('#signupModal');

    // Open modal
    await page.locator('#openSignupModal').click();
    await expect(modal).toHaveClass(/open/);

    // Click on the overlay (outside the modal content)
    await modal.click({ position: { x: 10, y: 10 } });

    // Modal should be hidden
    await expect(modal).not.toHaveClass(/open/);
  });

  test('should close modal when pressing Escape', async ({ page }) => {
    const modal = page.locator('#signupModal');

    // Open modal
    await page.locator('#openSignupModal').click();
    await expect(modal).toHaveClass(/open/);

    // Press Escape
    await page.keyboard.press('Escape');

    // Modal should be hidden
    await expect(modal).not.toHaveClass(/open/);
  });

  test('should show error when submitting without completing Turnstile', async ({ page }) => {
    await page.locator('#openSignupModal').click();

    // Fill email
    await page.locator('#email').fill('test@example.com');

    // Submit form without completing Turnstile
    await page.locator('#submitButton').click();

    // Should show error message
    const formMessage = page.locator('#formMessage');
    await expect(formMessage).toBeVisible();
    await expect(formMessage).toHaveText('Please complete the security check.');
    await expect(formMessage).toHaveClass(/error-message/);
    await page.screenshot({ path: 'test-results/06-turnstile-error.png', fullPage: true });
  });

  test('should validate email input is required', async ({ page }) => {
    await page.locator('#openSignupModal').click();

    const emailInput = page.locator('#email');
    await expect(emailInput).toHaveAttribute('required', '');
    await expect(emailInput).toHaveAttribute('type', 'email');
  });
});

test.describe('Signup Button Modal - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should show Subscribe button on mobile', async ({ page }) => {
    await page.goto('/');
    const subscribeButton = page.locator('#openSignupModal');
    await expect(subscribeButton).toBeVisible();
    await page.screenshot({ path: 'test-results/07-mobile-button.png', fullPage: true });
  });

  test('should open full-screen modal on mobile', async ({ page }) => {
    await page.goto('/');
    await page.locator('#openSignupModal').click();

    const modalContent = page.locator('.modal-content');
    await expect(modalContent).toBeVisible();
    await page.screenshot({ path: 'test-results/08-mobile-modal.png', fullPage: true });

    // Check that modal takes full width on mobile
    const box = await modalContent.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(370); // Almost full width
  });

  test('should show Turnstile widget on mobile', async ({ page }) => {
    await page.goto('/');
    await page.locator('#openSignupModal').click();

    const turnstileContainer = page.locator('.cf-turnstile');
    await expect(turnstileContainer).toBeVisible();
    await page.screenshot({ path: 'test-results/09-mobile-turnstile.png', fullPage: true });

    // Check it's within viewport
    const box = await turnstileContainer.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.x).toBeGreaterThanOrEqual(0);
    expect(box?.width).toBeLessThanOrEqual(375);
  });
});

test.describe('Signup Button on About Page', () => {
  test('should show Subscribe button on about page', async ({ page }) => {
    await page.goto('/about');
    const subscribeButton = page.locator('#openSignupModal');
    await expect(subscribeButton).toBeVisible();
    await page.screenshot({ path: 'test-results/10-about-button.png', fullPage: true });
  });

  test('should open modal on about page', async ({ page }) => {
    await page.goto('/about');
    await page.locator('#openSignupModal').click();

    const modal = page.locator('#signupModal');
    await expect(modal).toHaveClass(/open/);
    await page.screenshot({ path: 'test-results/11-about-modal.png', fullPage: true });
  });
});
