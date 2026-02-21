import { render, screen } from '@testing-library/react';
import { Navbar } from '../navbar.component';

jest.mock('next/navigation', () => ({
	usePathname: () => '/',
}));

describe('Navbar', () => {
	it('renders the logo name', () => {
		render(<Navbar />);
		expect(screen.getByText('rotem-horovitz')).toBeInTheDocument();
	});

	it('renders all enabled nav items', () => {
		render(<Navbar />);
		expect(screen.getByText('_hello')).toBeInTheDocument();
		expect(screen.getByText('_about-me')).toBeInTheDocument();
	});

	it('does not render disabled nav items', () => {
		render(<Navbar />);
		expect(screen.queryByText('_projects')).not.toBeInTheDocument();
	});

	it('renders the contact link', () => {
		render(<Navbar />);
		expect(screen.getByText('_contact-me')).toBeInTheDocument();
	});

	it('marks _hello as the active nav item when on the home page', () => {
		render(<Navbar />);
		const helloLink = screen.getByText('_hello').closest('a');
		expect(helloLink).toHaveAttribute('aria-current', 'page');
	});

	it('does not mark _about-me as active when on the home page', () => {
		render(<Navbar />);
		expect(screen.getByText('_about-me').closest('a')).not.toHaveAttribute('aria-current');
	});

	it('has correct href attributes', () => {
		render(<Navbar />);
		expect(screen.getByText('_hello').closest('a')).toHaveAttribute('href', '/');
		expect(screen.getByText('_about-me').closest('a')).toHaveAttribute('href', '/about-me');
		expect(screen.getByText('_contact-me').closest('a')).toHaveAttribute(
			'href',
			'#contact-me',
		);
	});

	it('has a navigation landmark', () => {
		render(<Navbar />);
		expect(screen.getByRole('navigation')).toBeInTheDocument();
	});
});
