import { render, screen } from '@testing-library/react';
import { Navbar } from '../navbar.component';

describe('Navbar', () => {
	it('renders the logo name', () => {
		render(<Navbar />);
		expect(screen.getByText('rotem-horovitz')).toBeInTheDocument();
	});

	it('renders all nav items', () => {
		render(<Navbar />);
		expect(screen.getByText('_hello')).toBeInTheDocument();
		expect(screen.getByText('_projects')).toBeInTheDocument();
	});

	it('does not render disabled nav items', () => {
		render(<Navbar />);
		expect(screen.queryByText('_about-me')).not.toBeInTheDocument();
	});

	it('renders the contact link', () => {
		render(<Navbar />);
		expect(screen.getByText('_contact-me')).toBeInTheDocument();
	});

	it('marks _hello as the active nav item', () => {
		render(<Navbar />);
		const helloLink = screen.getByText('_hello');
		expect(helloLink).toHaveAttribute('aria-current', 'page');
	});

	it('does not mark other nav items as active', () => {
		render(<Navbar />);
		expect(screen.getByText('_projects')).not.toHaveAttribute('aria-current');
	});

	it('has correct href attributes', () => {
		render(<Navbar />);
		expect(screen.getByText('_hello')).toHaveAttribute('href', '#hello');
		expect(screen.getByText('_projects')).toHaveAttribute('href', '#projects');
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
