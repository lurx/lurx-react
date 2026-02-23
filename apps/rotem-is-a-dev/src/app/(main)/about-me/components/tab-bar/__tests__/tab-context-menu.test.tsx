import { fireEvent, render, screen } from '@testing-library/react';
import { TabContextMenu } from '../tab-context-menu.component';

const defaultProps = {
	position: { x: 100, y: 200 },
	onClose: jest.fn(),
	onCloseOthers: jest.fn(),
	onCloseAll: jest.fn(),
	onDismiss: jest.fn(),
};

let portalRoot: HTMLDivElement;

beforeEach(() => {
	jest.clearAllMocks();
	portalRoot = document.createElement('div');
	portalRoot.id = 'portal-root';
	document.body.appendChild(portalRoot);
});

afterEach(() => {
	portalRoot.remove();
});

describe('TabContextMenu', () => {
	it('renders the menu at the given position', () => {
		render(<TabContextMenu {...defaultProps} />);
		const menu = screen.getByTestId('tab-context-menu');
		expect(menu).toBeInTheDocument();
		expect(menu.style.top).toBe('200px');
		expect(menu.style.left).toBe('100px');
	});

	it('renders Close, Close Others, and Close All items', () => {
		render(<TabContextMenu {...defaultProps} />);
		expect(screen.getByText('Close')).toBeInTheDocument();
		expect(screen.getByText('Close Others')).toBeInTheDocument();
		expect(screen.getByText('Close All')).toBeInTheDocument();
	});

	it('calls onClose and onDismiss when Close is clicked', () => {
		render(<TabContextMenu {...defaultProps} />);
		fireEvent.click(screen.getByText('Close'));
		expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
		expect(defaultProps.onDismiss).toHaveBeenCalledTimes(1);
	});

	it('calls onCloseOthers and onDismiss when Close Others is clicked', () => {
		render(<TabContextMenu {...defaultProps} />);
		fireEvent.click(screen.getByText('Close Others'));
		expect(defaultProps.onCloseOthers).toHaveBeenCalledTimes(1);
		expect(defaultProps.onDismiss).toHaveBeenCalledTimes(1);
	});

	it('calls onCloseAll and onDismiss when Close All is clicked', () => {
		render(<TabContextMenu {...defaultProps} />);
		fireEvent.click(screen.getByText('Close All'));
		expect(defaultProps.onCloseAll).toHaveBeenCalledTimes(1);
		expect(defaultProps.onDismiss).toHaveBeenCalledTimes(1);
	});

	it('dismisses on Escape key', () => {
		render(<TabContextMenu {...defaultProps} />);
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(defaultProps.onDismiss).toHaveBeenCalledTimes(1);
	});

	it('dismisses on outside click', () => {
		render(<TabContextMenu {...defaultProps} />);
		fireEvent.mouseDown(document.body);
		expect(defaultProps.onDismiss).toHaveBeenCalledTimes(1);
	});

	it('does not dismiss when clicking inside the menu', () => {
		render(<TabContextMenu {...defaultProps} />);
		fireEvent.mouseDown(screen.getByTestId('tab-context-menu'));
		expect(defaultProps.onDismiss).not.toHaveBeenCalled();
	});
});
