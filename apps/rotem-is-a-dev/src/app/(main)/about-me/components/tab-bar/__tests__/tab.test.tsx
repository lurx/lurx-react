import { fireEvent, render, screen } from '@testing-library/react';
import { Tab } from '../tab.component';
import type { AboutFileId } from '../../../data/about-files.data';

jest.mock('@/app/components', () => ({
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="icon">{iconName}</span>
	),
}));

const defaultProps = {
	tabId: 'bio' as AboutFileId,
	isActive: false,
	onSelect: jest.fn(),
	onClose: jest.fn(),
	onContextMenu: jest.fn(),
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('Tab', () => {
	it('renders the tab title from ABOUT_FILES', () => {
		render(<Tab {...defaultProps} />);
		expect(screen.getByText('bio')).toBeInTheDocument();
	});

	it('renders with role="tab"', () => {
		render(<Tab {...defaultProps} />);
		expect(screen.getByRole('tab')).toBeInTheDocument();
	});

	it('sets aria-selected to false when not active', () => {
		render(<Tab {...defaultProps} isActive={false} />);
		expect(screen.getByRole('tab')).toHaveAttribute('aria-selected', 'false');
	});

	it('sets aria-selected to true when active', () => {
		render(<Tab {...defaultProps} isActive={true} />);
		expect(screen.getByRole('tab')).toHaveAttribute('aria-selected', 'true');
	});

	it('applies active styles when isActive is true', () => {
		render(<Tab {...defaultProps} isActive={true} />);
		expect(screen.getByRole('tab').className).toContain('activeTab');
	});

	it('does not apply active styles when isActive is false', () => {
		render(<Tab {...defaultProps} isActive={false} />);
		expect(screen.getByRole('tab').className).not.toContain('activeTab');
	});

	it('sets tabIndex to 0 when active', () => {
		render(<Tab {...defaultProps} isActive={true} />);
		expect(screen.getByRole('tab')).toHaveAttribute('tabindex', '0');
	});

	it('sets tabIndex to -1 when not active', () => {
		render(<Tab {...defaultProps} isActive={false} />);
		expect(screen.getByRole('tab')).toHaveAttribute('tabindex', '-1');
	});

	it('calls onSelect with tabId when tab is clicked', () => {
		const onSelect = jest.fn();
		render(<Tab {...defaultProps} onSelect={onSelect} />);
		fireEvent.click(screen.getByRole('tab'));
		expect(onSelect).toHaveBeenCalledWith('bio');
	});

	it('calls onSelect with tabId when Enter key is pressed', () => {
		const onSelect = jest.fn();
		render(<Tab {...defaultProps} onSelect={onSelect} />);
		fireEvent.keyDown(screen.getByRole('tab'), { key: 'Enter' });
		expect(onSelect).toHaveBeenCalledWith('bio');
	});

	it('calls onSelect with tabId when Space key is pressed', () => {
		const onSelect = jest.fn();
		render(<Tab {...defaultProps} onSelect={onSelect} />);
		fireEvent.keyDown(screen.getByRole('tab'), { key: ' ' });
		expect(onSelect).toHaveBeenCalledWith('bio');
	});

	it('does not call onSelect for other key presses', () => {
		const onSelect = jest.fn();
		render(<Tab {...defaultProps} onSelect={onSelect} />);
		fireEvent.keyDown(screen.getByRole('tab'), { key: 'ArrowRight' });
		expect(onSelect).not.toHaveBeenCalled();
	});

	it('calls onClose with tabId when close button is clicked', () => {
		const onClose = jest.fn();
		render(<Tab {...defaultProps} onClose={onClose} />);
		fireEvent.click(screen.getByLabelText('Close bio tab'));
		expect(onClose).toHaveBeenCalledWith('bio');
	});

	it('does not call onSelect when close button is clicked', () => {
		const onSelect = jest.fn();
		render(<Tab {...defaultProps} onSelect={onSelect} />);
		fireEvent.click(screen.getByLabelText('Close bio tab'));
		expect(onSelect).not.toHaveBeenCalled();
	});

	it('calls onContextMenu with tabId and event on right-click', () => {
		const onContextMenu = jest.fn();
		render(<Tab {...defaultProps} onContextMenu={onContextMenu} />);
		fireEvent.contextMenu(screen.getByRole('tab'));
		expect(onContextMenu).toHaveBeenCalledWith('bio', expect.any(Object));
	});

	it('renders a close button with correct aria-label', () => {
		render(<Tab {...defaultProps} tabId={'interests' as AboutFileId} />);
		expect(screen.getByLabelText('Close interests tab')).toBeInTheDocument();
	});

	it('renders an xmark icon in the close button', () => {
		render(<Tab {...defaultProps} />);
		expect(screen.getByTestId('icon')).toHaveTextContent('xmark');
	});
});
