import { render, screen } from '@testing-library/react';
import { useResponsive } from '@/hooks';

jest.mock('@/hooks', () => ({
	useResponsive: jest.fn(),
}));

const mockUseResponsive = jest.mocked(useResponsive);

import { ContactButton } from '../contact-button.component';

describe('ContactButton', () => {
	it('returns null on mobile', () => {
		mockUseResponsive.mockReturnValue({
			isMobile: true,
			isTablet: false,
			isDesktop: false,
		});
		const { container } = render(<ContactButton />);
		expect(container.innerHTML).toBe('');
	});

	it('renders the contact link on desktop', () => {
		mockUseResponsive.mockReturnValue({
			isMobile: false,
			isTablet: false,
			isDesktop: true,
		});
		render(<ContactButton />);
		expect(screen.getByText('_contact-me')).toBeInTheDocument();
	});
});
