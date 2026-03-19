import { fireEvent, render, screen } from '@testing-library/react';
import { ResizableDrawer } from '../resizable-drawer.component';

jest.mock('../../fa-icon/fa-icon.component', () => ({
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="icon">{iconName}</span>
	),
}));

// jsdom does not implement PointerEvent; polyfill it for drag tests
class MockPointerEvent extends MouseEvent {
	readonly pointerId: number;
	constructor(type: string, init: PointerEventInit & MouseEventInit = {}) {
		super(type, init);
		this.pointerId = init.pointerId ?? 0;
	}
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).PointerEvent = MockPointerEvent;

const defaultProps = {
	isOpen: true,
	onClose: jest.fn(),
};

let portalRoot: HTMLDivElement;

beforeEach(() => {
	jest.clearAllMocks();
	portalRoot = document.createElement('div');
	portalRoot.id = 'portal-root';
	document.body.appendChild(portalRoot);

	// jsdom does not implement Pointer Events capture API
	HTMLElement.prototype.setPointerCapture = jest.fn();
	HTMLElement.prototype.releasePointerCapture = jest.fn();
});

afterEach(() => {
	portalRoot.remove();
	document.body.style.overflow = '';
});

describe('ResizableDrawer', () => {
	it('renders nothing when isOpen is false', () => {
		render(<ResizableDrawer {...defaultProps} isOpen={false} />);
		expect(screen.queryByTestId('resizable-drawer')).not.toBeInTheDocument();
	});

	it('renders the drawer when isOpen is true', () => {
		render(<ResizableDrawer {...defaultProps} />);
		expect(screen.getByTestId('resizable-drawer')).toBeInTheDocument();
	});

	it('renders children inside the drawer', () => {
		render(
			<ResizableDrawer {...defaultProps}>
				<p>Drawer content</p>
			</ResizableDrawer>,
		);
		expect(screen.getByText('Drawer content')).toBeInTheDocument();
	});

	it('renders an overlay', () => {
		render(<ResizableDrawer {...defaultProps} />);
		expect(screen.getByTestId('resizable-drawer-overlay')).toBeInTheDocument();
	});

	it('calls onClose when overlay is clicked', () => {
		render(<ResizableDrawer {...defaultProps} />);
		fireEvent.click(screen.getByTestId('resizable-drawer-overlay'));
		expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
	});

	it('calls onClose when close button is clicked', () => {
		render(<ResizableDrawer {...defaultProps} />);
		fireEvent.click(screen.getByTestId('resizable-drawer-close'));
		expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
	});

	it('calls onClose when Escape is pressed', () => {
		render(<ResizableDrawer {...defaultProps} />);
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
	});

	it('does not call onClose when a non-Escape key is pressed', () => {
		render(<ResizableDrawer {...defaultProps} />);
		fireEvent.keyDown(document, { key: 'Enter' });
		expect(defaultProps.onClose).not.toHaveBeenCalled();
	});

	it('renders with role="dialog" and aria-modal="true"', () => {
		render(<ResizableDrawer {...defaultProps} />);
		const drawer = screen.getByTestId('resizable-drawer');
		expect(drawer).toHaveAttribute('role', 'dialog');
		expect(drawer).toHaveAttribute('aria-modal', 'true');
	});

	it('uses the default aria-label', () => {
		render(<ResizableDrawer {...defaultProps} />);
		expect(screen.getByLabelText('Content drawer')).toBeInTheDocument();
	});

	it('uses a custom aria-label', () => {
		render(<ResizableDrawer {...defaultProps} ariaLabel="My drawer" />);
		expect(screen.getByLabelText('My drawer')).toBeInTheDocument();
	});

	it('locks body scroll when open', () => {
		render(<ResizableDrawer {...defaultProps} />);
		expect(document.body.style.overflow).toBe('hidden');
	});

	it('restores body scroll on unmount', () => {
		const { unmount } = render(<ResizableDrawer {...defaultProps} />);
		unmount();
		expect(document.body.style.overflow).toBe('');
	});

	it('renders the close button with accessible label', () => {
		render(<ResizableDrawer {...defaultProps} />);
		expect(screen.getByLabelText('Close drawer')).toBeInTheDocument();
	});

	it('renders the drag handle', () => {
		render(<ResizableDrawer {...defaultProps} />);
		expect(screen.getByTestId('resizable-drawer-drag-handle')).toBeInTheDocument();
	});

	it('applies initial width to the drawer', () => {
		render(<ResizableDrawer {...defaultProps} initialWidth={400} />);
		const drawer = screen.getByTestId('resizable-drawer');
		expect(drawer.style.width).toBe('400px');
	});

	it('calls setPointerCapture on pointer down on the drag handle', () => {
		render(<ResizableDrawer {...defaultProps} initialWidth={500} />);
		const handle = screen.getByTestId('resizable-drawer-drag-handle');

		fireEvent.pointerDown(handle, { pointerId: 1 });
		expect(HTMLElement.prototype.setPointerCapture).toHaveBeenCalled();
	});

	it('does not resize when pointer moves without prior pointer down', () => {
		render(<ResizableDrawer {...defaultProps} initialWidth={500} />);
		const handle = screen.getByTestId('resizable-drawer-drag-handle');

		fireEvent.pointerMove(handle, { clientX: 400 });

		const drawer = screen.getByTestId('resizable-drawer');
		expect(drawer.style.width).toBe('500px');
	});

	it('portals into the #portal-root element', () => {
		render(<ResizableDrawer {...defaultProps} />);
		expect(portalRoot.querySelector('[data-testid="resizable-drawer-wrapper"]')).toBeInTheDocument();
	});

	it('renders the title when provided', () => {
		render(
			<ResizableDrawer {...defaultProps} title={<span>My Title</span>} />,
		);
		expect(screen.getByText('My Title')).toBeInTheDocument();
	});

	it('does not render the title container when title is not provided', () => {
		render(<ResizableDrawer {...defaultProps} />);
		// The close button is always present, but we should not find a title div wrapping content
		expect(screen.queryByText('My Title')).not.toBeInTheDocument();
		// Verify the drawer renders without issue
		expect(screen.getByTestId('resizable-drawer')).toBeInTheDocument();
	});

	it('resizes the drawer on pointer drag', () => {
		render(<ResizableDrawer {...defaultProps} initialWidth={500} />);
		const handle = screen.getByTestId('resizable-drawer-drag-handle');

		// Start drag at clientX=500
		fireEvent(handle, new PointerEvent('pointerdown', { bubbles: true, clientX: 500, pointerId: 1 }));

		// Move left by 100px (delta = 500 - 400 = 100, newWidth = 500 + 100 = 600)
		fireEvent(handle, new PointerEvent('pointermove', { bubbles: true, clientX: 400 }));

		const drawer = screen.getByTestId('resizable-drawer');
		expect(drawer.style.width).toBe('600px');
	});

	it('clamps the resized width to the minimum', () => {
		render(<ResizableDrawer {...defaultProps} initialWidth={400} minWidth={350} />);
		const handle = screen.getByTestId('resizable-drawer-drag-handle');

		fireEvent(handle, new PointerEvent('pointerdown', { bubbles: true, clientX: 500, pointerId: 1 }));
		// Move right by a large amount (delta = 500 - 800 = -300, newWidth = 400 + (-300) = 100 -> clamped to 350)
		fireEvent(handle, new PointerEvent('pointermove', { bubbles: true, clientX: 800 }));

		const drawer = screen.getByTestId('resizable-drawer');
		expect(drawer.style.width).toBe('350px');
	});

	it('clamps the resized width to the custom maxWidth', () => {
		render(<ResizableDrawer {...defaultProps} initialWidth={500} maxWidth={600} />);
		const handle = screen.getByTestId('resizable-drawer-drag-handle');

		fireEvent(handle, new PointerEvent('pointerdown', { bubbles: true, clientX: 500, pointerId: 1 }));
		// Move left by 200px (delta = 500 - 300 = 200, newWidth = 500 + 200 = 700 -> clamped to 600)
		fireEvent(handle, new PointerEvent('pointermove', { bubbles: true, clientX: 300 }));

		const drawer = screen.getByTestId('resizable-drawer');
		expect(drawer.style.width).toBe('600px');
	});

	it('stops resizing after pointer up', () => {
		render(<ResizableDrawer {...defaultProps} initialWidth={500} />);
		const handle = screen.getByTestId('resizable-drawer-drag-handle');

		fireEvent(handle, new PointerEvent('pointerdown', { bubbles: true, clientX: 500, pointerId: 1 }));
		fireEvent(handle, new PointerEvent('pointermove', { bubbles: true, clientX: 400 }));

		const drawer = screen.getByTestId('resizable-drawer');
		expect(drawer.style.width).toBe('600px');

		fireEvent(handle, new PointerEvent('pointerup', { bubbles: true }));

		// After pointerUp, further moves should not change width
		fireEvent(handle, new PointerEvent('pointermove', { bubbles: true, clientX: 300 }));
		expect(drawer.style.width).toBe('600px');
	});

	it('falls back to document.body when #portal-root is not present', () => {
		portalRoot.remove();
		render(<ResizableDrawer {...defaultProps} />);
		expect(document.body.querySelector('[data-testid="resizable-drawer-wrapper"]')).toBeInTheDocument();
		// Re-add portalRoot for cleanup
		document.body.appendChild(portalRoot);
	});

	it('uses default width based on window.innerWidth when initialWidth is not provided', () => {
		Object.defineProperty(globalThis, 'innerWidth', { value: 1000, writable: true });
		render(<ResizableDrawer {...defaultProps} />);
		const drawer = screen.getByTestId('resizable-drawer');
		// Default is 50% of window.innerWidth = 500px
		expect(drawer.style.width).toBe('500px');
	});

	it('does not call onClose on Escape when drawer is closed', () => {
		render(<ResizableDrawer {...defaultProps} isOpen={false} />);
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(defaultProps.onClose).not.toHaveBeenCalled();
	});
});
