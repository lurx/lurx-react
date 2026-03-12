import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('@/app/components/fa-icon', () => ({
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="fa-icon" data-icon={iconName} />
	),
}));

jest.mock('usehooks-ts', () => ({
	useEventListener: (event: string, handler: (ev: Event) => void) => {
		const { useEffect } = require('react');
		useEffect(() => {
			globalThis.document.addEventListener(event, handler);
			return () => globalThis.document.removeEventListener(event, handler);
		}, [event, handler]);
	},
}));

import { Dialog } from '../dialog.component';

const mockOnClose = jest.fn();

beforeEach(() => {
	jest.clearAllMocks();
	document.body.style.overflow = '';

	let portalRoot = document.getElementById('portal-root');
	if (!portalRoot) {
		portalRoot = document.createElement('div');
		portalRoot.id = 'portal-root';
		document.body.appendChild(portalRoot);
	}
});

afterEach(() => {
	const portalRoot = document.getElementById('portal-root');
	if (portalRoot) {
		portalRoot.innerHTML = '';
	}
});

describe('Dialog', () => {
	it('renders nothing when closed', () => {
		render(
			<Dialog isOpen={false} onClose={mockOnClose} ariaLabel="Test dialog">
				<p>Content</p>
			</Dialog>,
		);
		expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
	});

	it('renders dialog when open', () => {
		render(
			<Dialog isOpen={true} onClose={mockOnClose} ariaLabel="Test dialog">
				<p>Content</p>
			</Dialog>,
		);
		expect(screen.getByTestId('dialog')).toBeInTheDocument();
	});

	it('renders children', () => {
		render(
			<Dialog isOpen={true} onClose={mockOnClose} ariaLabel="Test dialog">
				<p>Dialog content</p>
			</Dialog>,
		);
		expect(screen.getByText('Dialog content')).toBeInTheDocument();
	});

	it('calls onClose when overlay is clicked', () => {
		render(
			<Dialog isOpen={true} onClose={mockOnClose} ariaLabel="Test dialog">
				<p>Content</p>
			</Dialog>,
		);
		fireEvent.click(screen.getByTestId('dialog-overlay'));
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it('calls onClose when Escape key is pressed', () => {
		render(
			<Dialog isOpen={true} onClose={mockOnClose} ariaLabel="Test dialog">
				<p>Content</p>
			</Dialog>,
		);
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it('does not call onClose for non-Escape keys', () => {
		render(
			<Dialog isOpen={true} onClose={mockOnClose} ariaLabel="Test dialog">
				<p>Content</p>
			</Dialog>,
		);
		fireEvent.keyDown(document, { key: 'Enter' });
		expect(mockOnClose).not.toHaveBeenCalled();
	});

	it('locks body scroll when open', () => {
		render(
			<Dialog isOpen={true} onClose={mockOnClose} ariaLabel="Test dialog">
				<p>Content</p>
			</Dialog>,
		);
		expect(document.body.style.overflow).toBe('hidden');
	});

	it('restores body scroll on unmount', () => {
		const { unmount } = render(
			<Dialog isOpen={true} onClose={mockOnClose} ariaLabel="Test dialog">
				<p>Content</p>
			</Dialog>,
		);
		expect(document.body.style.overflow).toBe('hidden');
		unmount();
		expect(document.body.style.overflow).toBe('');
	});

	it('uses native dialog element with aria-label', () => {
		render(
			<Dialog isOpen={true} onClose={mockOnClose} ariaLabel="Test dialog">
				<p>Content</p>
			</Dialog>,
		);
		const dialog = screen.getByTestId('dialog');
		expect(dialog.tagName).toBe('DIALOG');
		expect(dialog).toHaveAttribute('open');
		expect(dialog).toHaveAttribute('aria-label', 'Test dialog');
	});

	it('portals into portal-root', () => {
		render(
			<Dialog isOpen={true} onClose={mockOnClose} ariaLabel="Test dialog">
				<p>Content</p>
			</Dialog>,
		);
		const portalRoot = document.getElementById('portal-root');
		expect(
			portalRoot?.querySelector('[data-testid="dialog"]'),
		).toBeInTheDocument();
	});

	it('calls onClose when close button is clicked', () => {
		render(
			<Dialog isOpen={true} onClose={mockOnClose} ariaLabel="Test dialog">
				<p>Content</p>
			</Dialog>,
		);
		fireEvent.click(screen.getByLabelText('Close dialog'));
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it('applies fullScreen class when fullScreen prop is true', () => {
		render(
			<Dialog
				isOpen={true}
				onClose={mockOnClose}
				ariaLabel="Test dialog"
				fullScreen
			>
				<p>Content</p>
			</Dialog>,
		);
		const dialog = screen.getByTestId('dialog');
		expect(dialog.className).toContain('fullScreen');
	});

	it('does not apply fullScreen class by default', () => {
		render(
			<Dialog isOpen={true} onClose={mockOnClose} ariaLabel="Test dialog">
				<p>Content</p>
			</Dialog>,
		);
		const dialog = screen.getByTestId('dialog');
		expect(dialog.className).not.toContain('fullScreen');
	});

	it('applies custom className to card', () => {
		render(
			<Dialog
				isOpen={true}
				onClose={mockOnClose}
				ariaLabel="Test dialog"
				className="custom-class"
			>
				<p>Content</p>
			</Dialog>,
		);
		const dialog = screen.getByTestId('dialog');
		expect(dialog).toHaveClass('custom-class');
	});
});
