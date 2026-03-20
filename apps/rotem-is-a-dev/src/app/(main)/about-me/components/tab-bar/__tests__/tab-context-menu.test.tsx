import { fireEvent, render, screen } from '@testing-library/react';
import { TabContextMenu } from '../tab-context-menu.component';

const defaultProps = {
	position: { x: 100, y: 200 },
	onCloseAction: jest.fn(),
	onCloseOthersAction: jest.fn(),
	onCloseAllAction: jest.fn(),
	onDismissAction: jest.fn(),
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

	it('calls onCloseAction and onDismissAction when Close is clicked', () => {
		render(<TabContextMenu {...defaultProps} />);
		fireEvent.click(screen.getByText('Close'));
		expect(defaultProps.onCloseAction).toHaveBeenCalledTimes(1);
		expect(defaultProps.onDismissAction).toHaveBeenCalledTimes(1);
	});

	it('calls onCloseOthersAction and onDismissAction when Close Others is clicked', () => {
		render(<TabContextMenu {...defaultProps} />);
		fireEvent.click(screen.getByText('Close Others'));
		expect(defaultProps.onCloseOthersAction).toHaveBeenCalledTimes(1);
		expect(defaultProps.onDismissAction).toHaveBeenCalledTimes(1);
	});

	it('calls onCloseAllAction and onDismissAction when Close All is clicked', () => {
		render(<TabContextMenu {...defaultProps} />);
		fireEvent.click(screen.getByText('Close All'));
		expect(defaultProps.onCloseAllAction).toHaveBeenCalledTimes(1);
		expect(defaultProps.onDismissAction).toHaveBeenCalledTimes(1);
	});

	it('dismisses on Escape key', () => {
		render(<TabContextMenu {...defaultProps} />);
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(defaultProps.onDismissAction).toHaveBeenCalledTimes(1);
	});

	it('dismisses on outside click', () => {
		render(<TabContextMenu {...defaultProps} />);
		fireEvent.mouseDown(document.body);
		expect(defaultProps.onDismissAction).toHaveBeenCalledTimes(1);
	});

	it('does not dismiss when clicking inside the menu', () => {
		render(<TabContextMenu {...defaultProps} />);
		fireEvent.mouseDown(screen.getByTestId('tab-context-menu'));
		expect(defaultProps.onDismissAction).not.toHaveBeenCalled();
	});

	it('renders into document.body when portal-root element does not exist', () => {
		portalRoot.remove();
		render(<TabContextMenu {...defaultProps} />);
		const menu = screen.getByTestId('tab-context-menu');
		expect(menu).toBeInTheDocument();
		expect(document.body.contains(menu)).toBe(true);
	});

	it('does not dismiss when a non-Escape key is pressed', () => {
		render(<TabContextMenu {...defaultProps} />);
		fireEvent.keyDown(document, { key: 'Enter' });
		expect(defaultProps.onDismissAction).not.toHaveBeenCalled();
	});
});
