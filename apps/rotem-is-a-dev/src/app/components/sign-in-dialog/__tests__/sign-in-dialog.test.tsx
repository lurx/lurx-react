import { fireEvent, render, screen } from '@testing-library/react';
import type { PropsWithChildren } from 'react';

const mockSignInWithGoogle = jest.fn();
const mockSignInWithGitHub = jest.fn();

jest.mock('@/app/context/auth', () => ({
	useAuth: () => ({
		signInWithGoogle: mockSignInWithGoogle,
		signInWithGitHub: mockSignInWithGitHub,
	}),
}));

type MockDialogProps = PropsWithChildren<{
	isOpen: boolean;
	onClose: () => void;
	ariaLabel: string;
	className?: string;
}>;

jest.mock('../../dialog', () => ({
	Dialog: ({ isOpen, onClose, ariaLabel, children }: MockDialogProps) =>
		isOpen ? (
			<dialog data-testid="mock-dialog" data-aria-label={ariaLabel} data-on-close={String(!!onClose)}>
				{children}
			</dialog>
		) : null,
}));

jest.mock('../../fa-icon', () => ({
	FaIcon: ({ iconName, iconGroup }: { iconName: string; iconGroup: string }) => (
		<span data-testid="fa-icon" data-icon={iconName} data-group={iconGroup} />
	),
}));

jest.mock('next/link', () => ({
	__esModule: true,
	default: ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
		<a href={href} onClick={onClick}>{children}</a>
	),
}));

import { SignInDialog } from '../sign-in-dialog.component';

const mockOnClose = jest.fn();

beforeEach(() => {
	jest.clearAllMocks();
});

describe('SignInDialog', () => {
	it('renders nothing when closed', () => {
		render(<SignInDialog isOpen={false} onClose={mockOnClose} />);
		expect(screen.queryByTestId('mock-dialog')).not.toBeInTheDocument();
	});

	it('renders dialog when open', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		expect(screen.getByTestId('mock-dialog')).toBeInTheDocument();
	});

	it('passes correct ariaLabel to Dialog', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		expect(screen.getByTestId('mock-dialog')).toHaveAttribute('data-aria-label', 'Sign in');
	});

	it('passes onClose to Dialog', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		expect(screen.getByTestId('mock-dialog')).toHaveAttribute('data-on-close', 'true');
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
		expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
	});

	it('renders GitHub sign-in button', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		expect(screen.getByTestId('sign-in-github')).toBeInTheDocument();
		expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument();
	});

	it('renders Google icon with fab group', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		const icons = screen.getAllByTestId('fa-icon');
		const googleIcon = icons.find(
			icon => icon.dataset.icon === 'google',
		);
		expect(googleIcon).toHaveAttribute('data-group', 'fab');
	});

	it('renders GitHub icon with fab group', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		const icons = screen.getAllByTestId('fa-icon');
		const githubIcon = icons.find(
			icon => icon.dataset.icon === 'github',
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

	it('renders privacy policy note', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		expect(screen.getByText(/By signing in, you agree to my/)).toBeInTheDocument();
	});

	it('renders privacy policy link with correct href', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		const link = screen.getByRole('link', { name: 'Privacy Policy', hidden: true });
		expect(link).toHaveAttribute('href', '/privacy-policy');
	});

	it('calls onClose when privacy policy link is clicked', () => {
		render(<SignInDialog isOpen={true} onClose={mockOnClose} />);
		fireEvent.click(screen.getByRole('link', { name: 'Privacy Policy', hidden: true }));
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});
});
