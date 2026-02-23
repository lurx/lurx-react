import { fireEvent, render, screen } from '@testing-library/react';

let mockPathname = '/';

jest.mock('next/navigation', () => ({
	usePathname: () => mockPathname,
}));

jest.mock('@/hooks', () => ({
	...jest.requireActual('@/hooks'),
	useResponsive: () => ({ isMobile: true, isTablet: false, isDesktop: false }),
}));

import { MobileMenu } from '../mobile-menu.component';

describe('MobileMenu', () => {
	beforeEach(() => {
		mockPathname = '/';
	});

	it('renders the hamburger button', () => {
		render(<MobileMenu />);
		expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
	});

	it('does not render the dropdown by default', () => {
		render(<MobileMenu />);
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('opens the dropdown when the hamburger is clicked', () => {
		render(<MobileMenu />);
		fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('updates aria-expanded when toggled', () => {
		render(<MobileMenu />);
		const button = screen.getByRole('button', { name: 'Open menu' });
		expect(button).toHaveAttribute('aria-expanded', 'false');

		fireEvent.click(button);
		expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
			'aria-expanded',
			'true',
		);
	});

	it('closes the dropdown when the hamburger is clicked again', () => {
		render(<MobileMenu />);
		fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
		expect(screen.getByRole('menu')).toBeInTheDocument();

		fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('closes the dropdown on Escape key', () => {
		render(<MobileMenu />);
		fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
		expect(screen.getByRole('menu')).toBeInTheDocument();

		fireEvent.keyDown(document, { key: 'Escape' });
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('renders the navigate header', () => {
		render(<MobileMenu />);
		fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
		expect(screen.getByText('# navigate:')).toBeInTheDocument();
	});

	it('renders enabled nav items', () => {
		render(<MobileMenu />);
		fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
		expect(screen.getByText('_hello')).toBeInTheDocument();
		expect(screen.getByText('_about-me')).toBeInTheDocument();
	});

	it('renders the projects nav item', () => {
		render(<MobileMenu />);
		fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
		expect(screen.getByText('_projects')).toBeInTheDocument();
	});

	it('marks the active route', () => {
		render(<MobileMenu />);
		fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
		const helloLink = screen.getByText('_hello').closest('a');
		expect(helloLink).toHaveAttribute('aria-current', 'page');
	});

	it('does not mark non-active routes', () => {
		render(<MobileMenu />);
		fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
		const aboutLink = screen.getByText('_about-me').closest('a');
		expect(aboutLink).not.toHaveAttribute('aria-current');
	});

	it('renders the download CV action', () => {
		render(<MobileMenu />);
		fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
		expect(screen.getByText('_download-cv')).toBeInTheDocument();
	});

	it('renders the contact me action', () => {
		render(<MobileMenu />);
		fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
		expect(screen.getByText('_contact-me')).toBeInTheDocument();
	});

	it('has correct href for download CV', () => {
		render(<MobileMenu />);
		fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
		const downloadLink = screen.getByText('_download-cv').closest('a');
		expect(downloadLink).toHaveAttribute('href', '#downloadPdf');
	});

	it('has correct href for contact me', () => {
		render(<MobileMenu />);
		fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
		const contactLink = screen.getByText('_contact-me').closest('a');
		expect(contactLink).toHaveAttribute('href', '#contact-me');
	});

	it('closes the dropdown on route change', () => {
		const { rerender } = render(<MobileMenu />);
		fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
		expect(screen.getByRole('menu')).toBeInTheDocument();

		mockPathname = '/about-me';
		rerender(<MobileMenu />);
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('has aria-controls linking to the dropdown', () => {
		render(<MobileMenu />);
		const button = screen.getByRole('button', { name: 'Open menu' });
		expect(button).toHaveAttribute('aria-controls', 'mobile-menu-dropdown');
	});
});
