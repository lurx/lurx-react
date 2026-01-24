import { render, screen } from '@testing-library/react';
import { HeaderThemeSwitcher } from '../header-theme-switcher.component';

describe('HeaderThemeSwitcher', () => {
	it('renders ThemeSwitcher', async () => {
		render(<HeaderThemeSwitcher />);
		// ThemeSwitcher shows theme name (e.g. dim) when mounted
		const buttons = await screen.findAllByRole('button', { name: /dim/i });
		expect(buttons.length).toBeGreaterThanOrEqual(1);
	});
});
