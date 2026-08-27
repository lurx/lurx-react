import { fireEvent, render, screen } from '@testing-library/react';
import { useMediaQuery } from 'usehooks-ts';
import { THEME_ATTRIBUTE, ThemeProvider } from '../../../theme';
import { ThemeToggleButton } from '../theme-toggle-button.component';

jest.mock('usehooks-ts', () => ({ useMediaQuery: jest.fn() }));

const mockUseMediaQuery = jest.mocked(useMediaQuery);
const mockGetItem = jest.mocked(localStorage.getItem);

const renderToggle = () =>
	render(
		<ThemeProvider>
			<ThemeToggleButton />
		</ThemeProvider>,
	);

beforeEach(() => {
	mockGetItem.mockReset();
	mockUseMediaQuery.mockReturnValue(false);
	document.documentElement.removeAttribute(THEME_ATTRIBUTE);
});

describe('ThemeToggleButton', () => {
	it('offers the dark theme while the page renders light', () => {
		renderToggle();

		expect(
			screen.getByRole('button', { name: 'Switch to dark theme' }),
		).toBeInTheDocument();
	});

	it('offers the light theme while the page renders dark', () => {
		mockGetItem.mockReturnValue(JSON.stringify('dark'));

		renderToggle();

		expect(
			screen.getByRole('button', { name: 'Switch to light theme' }),
		).toBeInTheDocument();
	});

	it('switches the page to dark when clicked from light', () => {
		renderToggle();

		fireEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));

		expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
		expect(
			screen.getByRole('button', { name: 'Switch to light theme' }),
		).toBeInTheDocument();
	});

	it('switches an OS-dark page to an explicit light theme', () => {
		mockUseMediaQuery.mockReturnValue(true);
		renderToggle();

		fireEvent.click(
			screen.getByRole('button', { name: 'Switch to light theme' }),
		);

		expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('light');
	});

	it('renders only the icon, with no visible label text', () => {
		renderToggle();

		const button = screen.getByRole('button', { name: 'Switch to dark theme' });
		expect(button).toHaveTextContent('');
	});
});
