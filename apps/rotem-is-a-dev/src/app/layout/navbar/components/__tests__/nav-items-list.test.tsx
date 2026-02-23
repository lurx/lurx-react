import { render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({
	usePathname: () => '/',
}));

import { NavItemsList } from '../nav-items-list.component';

describe('NavItemsList', () => {
	it('renders all enabled nav items', () => {
		render(<NavItemsList />);
		expect(screen.getByText('_hello')).toBeInTheDocument();
		expect(screen.getByText('_about-me')).toBeInTheDocument();
	});

	it('renders the projects nav item', () => {
		render(<NavItemsList />);
		expect(screen.getByText('_projects')).toBeInTheDocument();
	});

	it('marks the active route', () => {
		render(<NavItemsList />);
		const helloLink = screen.getByText('_hello').closest('a');
		expect(helloLink).toHaveAttribute('aria-current', 'page');
	});

	it('does not mark non-active routes', () => {
		render(<NavItemsList />);
		const aboutLink = screen.getByText('_about-me').closest('a');
		expect(aboutLink).not.toHaveAttribute('aria-current');
	});
});
