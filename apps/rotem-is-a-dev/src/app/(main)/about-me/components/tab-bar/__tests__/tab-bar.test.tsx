import { fireEvent, render, screen } from '@testing-library/react';
import { useResponsive } from '@/hooks';
import type { AboutFileId } from '../../../data/about-files.data';
import { TabBar } from '../tab-bar.component';

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
	openTabs: ['bio', 'interests'] as AboutFileId[],
	activeFileId: 'bio' as AboutFileId,
	onTabSelect: jest.fn(),
	onTabClose: jest.fn(),
	onCloseOthers: jest.fn(),
	onCloseAll: jest.fn(),
};

let portalRoot: HTMLDivElement;

beforeEach(() => {
	jest.clearAllMocks();
	mockUseResponsive.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true });
	portalRoot = document.createElement('div');
	portalRoot.id = 'portal-root';
	document.body.appendChild(portalRoot);
});

afterEach(() => {
	portalRoot.remove();
});

describe('TabBar', () => {
	it('renders all open tabs', () => {
		render(<TabBar {...defaultProps} />);
		expect(screen.getByText('bio')).toBeInTheDocument();
		expect(screen.getByText('interests')).toBeInTheDocument();
	});

	it('marks the active tab', () => {
		render(<TabBar {...defaultProps} />);
		const bioTab = screen.getByText('bio').closest('[role="tab"]');
		expect(bioTab).toHaveAttribute('aria-selected', 'true');
	});

	it('calls onTabSelect when a tab is clicked', () => {
		render(<TabBar {...defaultProps} />);
		fireEvent.click(screen.getByText('interests'));
		expect(defaultProps.onTabSelect).toHaveBeenCalledWith('interests');
	});

	it('calls onTabClose when the close button is clicked', () => {
		render(<TabBar {...defaultProps} />);
		fireEvent.click(screen.getByLabelText('Close bio tab'));
		expect(defaultProps.onTabClose).toHaveBeenCalled();
	});

	it('opens context menu on right-click', () => {
		render(<TabBar {...defaultProps} />);
		const bioTab = screen.getByRole('tab', { name: /bio/i });
		fireEvent.contextMenu(bioTab);
		expect(screen.getByTestId('tab-context-menu')).toBeInTheDocument();
	});

	it('prevents default browser context menu', () => {
		render(<TabBar {...defaultProps} />);
		const bioTab = screen.getByRole('tab', { name: /bio/i });
		const prevented = !fireEvent.contextMenu(bioTab);
		expect(prevented).toBe(true);
	});

	it('calls onCloseOthers via context menu', () => {
		render(<TabBar {...defaultProps} />);
		const bioTab = screen.getByRole('tab', { name: /bio/i });
		fireEvent.contextMenu(bioTab);
		fireEvent.click(screen.getByText('Close Others'));
		expect(defaultProps.onCloseOthers).toHaveBeenCalledWith('bio');
	});

	it('calls onCloseAll via context menu', () => {
		render(<TabBar {...defaultProps} />);
		const bioTab = screen.getByRole('tab', { name: /bio/i });
		fireEvent.contextMenu(bioTab);
		fireEvent.click(screen.getByText('Close All'));
		expect(defaultProps.onCloseAll).toHaveBeenCalled();
	});

	it('calls onTabClose via context menu Close', () => {
		render(<TabBar {...defaultProps} />);
		const bioTab = screen.getByRole('tab', { name: /bio/i });
		fireEvent.contextMenu(bioTab);
		fireEvent.click(screen.getByText('Close'));
		expect(defaultProps.onTabClose).toHaveBeenCalled();
	});

	it('dismisses context menu on Escape', () => {
		render(<TabBar {...defaultProps} />);
		const bioTab = screen.getByRole('tab', { name: /bio/i });
		fireEvent.contextMenu(bioTab);
		expect(screen.getByTestId('tab-context-menu')).toBeInTheDocument();
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(screen.queryByTestId('tab-context-menu')).not.toBeInTheDocument();
	});

	it('renders nothing on mobile', () => {
		mockUseResponsive.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false });
		const { container } = render(<TabBar {...defaultProps} />);
		expect(container.innerHTML).toBe('');
	});

	it('selects a tab when Enter key is pressed', () => {
		render(<TabBar {...defaultProps} />);
		const interestsTab = screen.getByRole('tab', { name: /interests/i });
		fireEvent.keyDown(interestsTab, { key: 'Enter' });
		expect(defaultProps.onTabSelect).toHaveBeenCalledWith('interests');
	});

	it('selects a tab when Space key is pressed', () => {
		render(<TabBar {...defaultProps} />);
		const interestsTab = screen.getByRole('tab', { name: /interests/i });
		fireEvent.keyDown(interestsTab, { key: ' ' });
		expect(defaultProps.onTabSelect).toHaveBeenCalledWith('interests');
	});

	it('does not select a tab for other key presses', () => {
		render(<TabBar {...defaultProps} />);
		const interestsTab = screen.getByRole('tab', { name: /interests/i });
		fireEvent.keyDown(interestsTab, { key: 'Tab' });
		expect(defaultProps.onTabSelect).not.toHaveBeenCalled();
	});
});
