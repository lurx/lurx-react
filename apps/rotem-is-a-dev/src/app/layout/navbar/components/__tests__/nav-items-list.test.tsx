import { render, screen } from '@testing-library/react';
import { useResponsive } from '@/hooks';

jest.mock('next/navigation', () => ({
	usePathname: () => '/',
}));
jest.mock('@/hooks', () => ({
	useResponsive: jest.fn(),
}));

const mockUseResponsive = jest.mocked(useResponsive);

beforeEach(() => {
	mockUseResponsive.mockReturnValue({
		isMobile: false,
		isTablet: false,
		isDesktop: true,
	});
});

import { NavItemsList } from '../nav-items-list.component';

describe('NavItemsList', () => {
	it('returns null on mobile', () => {
		mockUseResponsive.mockReturnValue({
			isMobile: true,
			isTablet: false,
			isDesktop: false,
		});
		const { container } = render(<NavItemsList />);
		expect(container.innerHTML).toBe('');
	});

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
