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
		expect(screen.getByText('_projects')).toBeInTheDocument();
	});

	it('renders the contact link', () => {
		render(<Navbar />);
		expect(screen.getByText('_contact-me')).toBeInTheDocument();
	});

	it('marks _hello as the active nav item when on the home page', () => {
		render(<Navbar />);
		const helloLink = screen.getByText('_hello');
		expect(helloLink).toHaveAttribute('aria-current', 'page');
	});

	it('does not mark _about-me as active when on the home page', () => {
		render(<Navbar />);
		expect(screen.getByText('_about-me')).not.toHaveAttribute('aria-current');
	});

	it('has correct href attributes', () => {
		render(<Navbar />);
		expect(screen.getByText('_hello')).toHaveAttribute('href', '/');
		expect(screen.getByText('_about-me')).toHaveAttribute('href', '/about-me');
		expect(screen.getByText('_projects')).toHaveAttribute('href', '/projects');
		expect(screen.getByText('_contact-me')).toHaveAttribute(
			'href',
			'#contact-me',
		);
	});

	it('has a navigation landmark', () => {
		render(<Navbar />);
		expect(screen.getByRole('navigation')).toBeInTheDocument();
	});
});
