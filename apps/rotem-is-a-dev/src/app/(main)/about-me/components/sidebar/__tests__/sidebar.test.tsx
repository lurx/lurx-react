import { fireEvent, render, screen } from '@testing-library/react';
import { useResponsive } from '@/hooks';
import { SideBar } from '../sidebar.component';
import type { AboutFileId } from '../../../data/about-files.data';

jest.mock('@/hooks', () => ({
	useResponsive: jest.fn(),
}));

jest.mock('@/app/components', () => ({
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="icon">{iconName}</span>
	),
}));

const mockUseResponsive = useResponsive as jest.Mock;

const defaultProps = {
	activeFileId: 'bio' as Nullable<AboutFileId>,
	onFileSelectAction: jest.fn(),
};

beforeEach(() => {
	jest.clearAllMocks();
	mockUseResponsive.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true });
});

describe('SideBar', () => {
	it('renders the sidebar with "About sections" label', () => {
		render(<SideBar {...defaultProps} />);
		expect(screen.getByLabelText('About sections')).toBeInTheDocument();
	});

	it('renders sidebar buttons for non-empty sections', () => {
		render(<SideBar {...defaultProps} />);
		expect(screen.getByRole('button', { name: 'Personal info' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Work experience' })).toBeInTheDocument();
	});

	it('marks the active section button as pressed', () => {
		render(<SideBar {...defaultProps} activeFileId="bio" />);
		expect(screen.getByRole('button', { name: 'Personal info' })).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByRole('button', { name: 'Work experience' })).toHaveAttribute('aria-pressed', 'false');
	});

	it('calls onFileSelectAction with the default file when a section button is clicked', () => {
		const onFileSelectAction = jest.fn();
		render(<SideBar {...defaultProps} onFileSelectAction={onFileSelectAction} />);
		fireEvent.click(screen.getByRole('button', { name: 'Work experience' }));
		expect(onFileSelectAction).toHaveBeenCalledWith('payoneer');
	});

	it('renders nothing on mobile', () => {
		mockUseResponsive.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false });
		const { container } = render(<SideBar {...defaultProps} />);
		expect(container.innerHTML).toBe('');
	});

	it('sets no section as active when activeFileId is null', () => {
		render(<SideBar {...defaultProps} activeFileId={null} />);
		expect(screen.getByRole('button', { name: 'Personal info' })).toHaveAttribute('aria-pressed', 'false');
		expect(screen.getByRole('button', { name: 'Work experience' })).toHaveAttribute('aria-pressed', 'false');
	});
});
