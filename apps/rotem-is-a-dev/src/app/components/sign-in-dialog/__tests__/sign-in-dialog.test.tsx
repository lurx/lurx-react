import { fireEvent, render, screen } from '@testing-library/react';

const mockSignInWithGoogle = jest.fn();
const mockSignInWithGitHub = jest.fn();

jest.mock('@/app/context/auth', () => ({
	useAuth: () => ({
		signInWithGoogle: mockSignInWithGoogle,
		signInWithGitHub: mockSignInWithGitHub,
	}),
}));

jest.mock('usehooks-ts', () => ({
	useEventListener: (event: string, handler: (e: KeyboardEvent) => void) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const { useEffect } = require('react');
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			globalThis.document.addEventListener(event, handler);
			return () => globalThis.document.removeEventListener(event, handler);
		}, [event, handler]);
	},
}));

jest.mock('../../fa-icon', () => ({
	FaIcon: ({ iconName, iconGroup }: { iconName: string; iconGroup: string }) => (
		<span data-testid="fa-icon" data-icon={iconName} data-group={iconGroup} />
	),
}));

import { SignInDialog } from '../sign-in-dialog.component';

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

describe('SignInDialog', () => {
	it('renders nothing when closed', () => {
		render(<SignInDialog isOpen={false} onClose={mockOnClose} />);
		expect(screen.queryByTestId('sign-in-dialog')).not.toBeInTheDocument();
	});

	it('renders dialog when open', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		expect(screen.getByTestId('sign-in-dialog')).toBeInTheDocument();
	});

	it('renders title text', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		expect(screen.getByText('Sign in with')).toBeInTheDocument();
	});

	it('renders why-login explanation', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		expect(screen.getByText('The only reason to login is to leave comments on projects and blog posts.')).toBeInTheDocument();
	});

	it('renders Google sign-in button', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		expect(screen.getByTestId('sign-in-google')).toBeInTheDocument();
		expect(screen.getByText('Google')).toBeInTheDocument();
	});

	it('renders GitHub sign-in button', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		expect(screen.getByTestId('sign-in-github')).toBeInTheDocument();
		expect(screen.getByText('GitHub')).toBeInTheDocument();
	});

	it('renders Google icon with fab group', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		const icons = screen.getAllByTestId('fa-icon');
		const googleIcon = icons.find(
			icon => icon.getAttribute('data-icon') === 'google',
		);
		expect(googleIcon).toHaveAttribute('data-group', 'fab');
	});

	it('renders GitHub icon with fab group', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		const icons = screen.getAllByTestId('fa-icon');
		const githubIcon = icons.find(
			icon => icon.getAttribute('data-icon') === 'github',
		);
		expect(githubIcon).toHaveAttribute('data-group', 'fab');
	});

	it('calls signInWithGoogle and onClose when Google button is clicked', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		fireEvent.click(screen.getByTestId('sign-in-google'));
		expect(mockOnClose).toHaveBeenCalledTimes(1);
		expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
	});

	it('calls signInWithGitHub and onClose when GitHub button is clicked', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		fireEvent.click(screen.getByTestId('sign-in-github'));
		expect(mockOnClose).toHaveBeenCalledTimes(1);
		expect(mockSignInWithGitHub).toHaveBeenCalledTimes(1);
	});

	it('calls onClose when overlay is clicked', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		fireEvent.click(screen.getByTestId('sign-in-dialog-overlay'));
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it('calls onClose when Escape key is pressed', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it('does not call onClose for non-Escape keys', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		fireEvent.keyDown(document, { key: 'Enter' });
		expect(mockOnClose).not.toHaveBeenCalled();
	});

	it('locks body scroll when open', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		expect(document.body.style.overflow).toBe('hidden');
	});

	it('restores body scroll on unmount', () => {
		const { unmount } = render(
			<SignInDialog isOpen={true} onClose={mockOnClose} />,
		);
		expect(document.body.style.overflow).toBe('hidden');
		unmount();
		expect(document.body.style.overflow).toBe('');
	});

	it('uses native dialog element with aria-label', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		const dialog = screen.getByTestId('sign-in-dialog');
		expect(dialog.tagName).toBe('DIALOG');
		expect(dialog).toHaveAttribute('open');
		expect(dialog).toHaveAttribute('aria-label', 'Sign in');
	});

	it('portals into portal-root', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		const portalRoot = document.getElementById('portal-root');
		expect(portalRoot?.querySelector('[data-testid="sign-in-dialog"]')).toBeInTheDocument();
	});
});
