import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeSwitcher } from '../theme-switcher';

describe('ThemeSwitcher', () => {
	beforeEach(() => {
		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: jest.fn(() => null),
				setItem: jest.fn(),
				removeItem: jest.fn(),
				clear: jest.fn(),
				length: 0,
				key: jest.fn(),
			},
			writable: true,
		});
		document.documentElement.setAttribute('data-theme', 'dim');
	});

	it('renders theme button when mounted', async () => {
		render(<ThemeSwitcher />);
		// Dropdown trigger and list both have "dim"; at least one button exists
		const buttons = await screen.findAllByRole('button', { name: /dim/i });
		expect(buttons.length).toBeGreaterThanOrEqual(1);
		expect(document.documentElement.getAttribute('data-theme')).toBeDefined();
	});

	it('shows theme options and updates document and localStorage on select', async () => {
		const setItem = jest.fn();
		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: jest.fn(() => null),
				setItem,
				removeItem: jest.fn(),
				clear: jest.fn(),
				length: 0,
				key: jest.fn(),
			},
			writable: true,
		});

		render(<ThemeSwitcher />);
		// Click trigger (first button with "dim")
		const triggers = await screen.findAllByRole('button', { name: /dim/i });
		fireEvent.click(triggers[0]);

		const winter = await screen.findByRole('button', { name: /winter/i });
		fireEvent.click(winter);

		expect(setItem).toHaveBeenCalledWith('story-wise-theme', 'winter');
		expect(document.documentElement.getAttribute('data-theme')).toBe('winter');
	});
});
