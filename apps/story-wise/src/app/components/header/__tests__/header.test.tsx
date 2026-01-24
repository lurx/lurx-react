import { render, screen } from '@testing-library/react';
import { Header } from '../header';

describe('Header', () => {
	it('renders a header with Story Wise link', () => {
		render(<Header />);
		expect(screen.getByRole('banner')).toBeInTheDocument();
		const link = screen.getByRole('link', { name: /story wise/i });
		expect(link).toHaveAttribute('href', '/');
	});

	it('renders theme switcher (dropdown with theme button)', async () => {
		render(<Header />);
		// ThemeSwitcher: trigger and list both have "dim"; at least one button
		const buttons = await screen.findAllByRole('button', { name: /dim/i });
		expect(buttons.length).toBeGreaterThanOrEqual(1);
	});
});
