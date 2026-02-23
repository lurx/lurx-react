import { fireEvent, render, screen } from '@testing-library/react';
import { ResizableDrawer } from '../resizable-drawer.component';

jest.mock('@/app/components/fa-icon/fa-icon.component', () => ({
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="icon">{iconName}</span>
	),
}));

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
});
