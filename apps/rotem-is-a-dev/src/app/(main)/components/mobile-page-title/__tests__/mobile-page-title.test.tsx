import { render, screen } from '@testing-library/react';
import { useResponsive } from '@/hooks';
import { MobilePageTitle } from '../mobile-page-title.component';

jest.mock('@/hooks', () => ({
	useResponsive: jest.fn(),
}));

const mockUseResponsive = useResponsive as jest.Mock;

describe('MobilePageTitle', () => {
	it('renders the title on mobile', () => {
		mockUseResponsive.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false });
		render(<MobilePageTitle title="_projects" />);
		expect(screen.getByText('_projects')).toBeInTheDocument();
	});

	it('renders as an h2 element', () => {
		mockUseResponsive.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false });
		render(<MobilePageTitle title="_about-me" />);
		expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('_about-me');
	});

	it('returns null on desktop', () => {
		mockUseResponsive.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true });
		const { container } = render(<MobilePageTitle title="_projects" />);
		expect(container).toBeEmptyDOMElement();
	});

	it('returns null on tablet', () => {
		mockUseResponsive.mockReturnValue({ isMobile: false, isTablet: true, isDesktop: false });
		const { container } = render(<MobilePageTitle title="_projects" />);
		expect(container).toBeEmptyDOMElement();
	});
});
