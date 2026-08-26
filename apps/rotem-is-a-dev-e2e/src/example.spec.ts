import { test, expect } from '@playwright/test';

const HERO_ANIMATION_TIMEOUT_MS = 15_000;

test('renders the hero heading', async ({ page }) => {
	await page.goto('/');

	// The hero types its heading in one character at a time, so the assertion
	// has to retry while the animation runs.
	await expect(page.locator('h1')).toHaveText('Rotem Horovitz', {
		timeout: HERO_ANIMATION_TIMEOUT_MS,
	});
});
