import { render, screen } from '@testing-library/react';
import { Navbar } from '../navbar.component';
import { ThemeProvider } from '../../theme';

jest.mock('next/navigation', () => ({
	usePathname: () => '/',
}));

// The theme switcher lives in here, so it needs the provider its page supplies.
const renderWithTheme = () =>
	render(
		<ThemeProvider>
			<Navbar />
		</ThemeProvider>,
	);

describe('Navbar', () => {
	it('renders the logo name', () => {
		renderWithTheme();
		expect(screen.getByText('rotem-horovitz')).toBeInTheDocument();
	});

	it('renders all enabled nav items', () => {
		renderWithTheme();
		expect(screen.getByText('_hello')).toBeInTheDocument();
		expect(screen.getByText('_about-me')).toBeInTheDocument();
	});

	it('renders the projects nav item', () => {
		renderWithTheme();
		expect(screen.getByText('_projects')).toBeInTheDocument();
	});

	it('marks _hello as the active nav item when on the home page', () => {
		renderWithTheme();
		const helloLink = screen.getByText('_hello').closest('a');
		expect(helloLink).toHaveAttribute('aria-current', 'page');
	});

	it('does not mark _about-me as active when on the home page', () => {
		renderWithTheme();
		expect(screen.getByText('_about-me').closest('a')).not.toHaveAttribute('aria-current');
	});

	it('has correct href attributes', () => {
		renderWithTheme();
		expect(screen.getByText('_hello').closest('a')).toHaveAttribute('href', '/');
		expect(screen.getByText('_about-me').closest('a')).toHaveAttribute('href', '/about-me');
	});

	it('has a navigation landmark', () => {
		renderWithTheme();
		expect(screen.getByRole('navigation')).toBeInTheDocument();
	});
});
