import { fireEvent, render, screen } from '@testing-library/react';

let mockUser: { displayName: string; email: string; photoURL: string | null; provider: string } | null = null;
let mockIsLoading = false;
const mockSignInWithGoogle = jest.fn();
const mockSignOut = jest.fn();
let mockIsMobile = false;

jest.mock('@/app/context/auth', () => ({
	useAuth: () => ({
		user: mockUser,
		isLoading: mockIsLoading,
		signInWithGoogle: mockSignInWithGoogle,
		signInWithGitHub: jest.fn(),
		signOut: mockSignOut,
	}),
}));

jest.mock('@/hooks', () => ({
	useResponsive: () => ({ isMobile: mockIsMobile }),
	useOnClickOutside: jest.fn(),
}));

jest.mock('@/app/components', () => ({
	FaIcon: ({ iconName, iconGroup }: { iconName: string; iconGroup: string }) => (
		<span data-testid="fa-icon" data-icon={iconName} data-group={iconGroup} />
	),
	UserAvatar: () => <span data-testid="user-avatar" />,
}));

jest.mock('@/app/components/sign-in-dialog', () => ({
	SignInDialog: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
		isOpen ? <button data-testid="sign-in-dialog" data-open={isOpen} onClick={onClose} /> : null,
}));

import { AuthButton } from '../auth-button.component';

beforeEach(() => {
	jest.clearAllMocks();
	mockUser = null;
	mockIsLoading = false;
	mockIsMobile = false;
});

describe('AuthButton', () => {
	it('returns null when loading', () => {
		mockIsLoading = true;
		const { container } = render(<AuthButton />);
		expect(container).toBeEmptyDOMElement();
	});

	it('returns null on mobile', () => {
		mockIsMobile = true;
		const { container } = render(<AuthButton />);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders sign-in button when no user is logged in', () => {
		render(<AuthButton />);
		expect(screen.getByText('_sign-in')).toBeInTheDocument();
	});

	it('opens sign-in dialog when sign-in button is clicked', () => {
		render(<AuthButton />);
		expect(screen.queryByTestId('sign-in-dialog')).not.toBeInTheDocument();
		fireEvent.click(screen.getByText('_sign-in'));
		expect(screen.getByTestId('sign-in-dialog')).toBeInTheDocument();
	});

	it('closes sign-in dialog when onClose is called', () => {
		render(<AuthButton />);
		fireEvent.click(screen.getByText('_sign-in'));
		expect(screen.getByTestId('sign-in-dialog')).toBeInTheDocument();
		fireEvent.click(screen.getByTestId('sign-in-dialog'));
		expect(screen.queryByTestId('sign-in-dialog')).not.toBeInTheDocument();
	});

	it('renders UserAvatar when user is logged in', () => {
		mockUser = {
			displayName: 'Test User',
			email: 'test@example.com',
			photoURL: 'https://photo.url/avatar.jpg',
			provider: 'google',
		};
		render(<AuthButton />);
		expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
	});

	it('opens dropdown when avatar is clicked', () => {
		mockUser = {
			displayName: 'Test User',
			email: 'test@example.com',
			photoURL: 'https://photo.url/avatar.jpg',
			provider: 'google',
		};
		render(<AuthButton />);
		fireEvent.click(screen.getByLabelText('User menu'));
		expect(screen.getByText('Test User')).toBeInTheDocument();
		expect(screen.getByText('test@example.com')).toBeInTheDocument();
	});

	it('shows sign out button in dropdown', () => {
		mockUser = {
			displayName: 'Test User',
			email: 'test@example.com',
			photoURL: 'https://photo.url/avatar.jpg',
			provider: 'google',
		};
		render(<AuthButton />);
		fireEvent.click(screen.getByLabelText('User menu'));
		expect(screen.getByRole('menuitem')).toHaveTextContent('Sign out');
	});

	it('calls signOut when sign out button is clicked', () => {
		mockUser = {
			displayName: 'Test User',
			email: 'test@example.com',
			photoURL: 'https://photo.url/avatar.jpg',
			provider: 'google',
		};
		render(<AuthButton />);
		fireEvent.click(screen.getByLabelText('User menu'));
		fireEvent.click(screen.getByRole('menuitem'));
		expect(mockSignOut).toHaveBeenCalledTimes(1);
	});

	it('closes dropdown after sign out', () => {
		mockUser = {
			displayName: 'Test User',
			email: 'test@example.com',
			photoURL: 'https://photo.url/avatar.jpg',
			provider: 'google',
		};
		render(<AuthButton />);
		fireEvent.click(screen.getByLabelText('User menu'));
		expect(screen.getByText('Test User')).toBeInTheDocument();
		fireEvent.click(screen.getByRole('menuitem'));
		expect(screen.queryByText('Test User')).not.toBeInTheDocument();
	});

	it('toggles dropdown open and closed', () => {
		mockUser = {
			displayName: 'Test User',
			email: 'test@example.com',
			photoURL: 'https://photo.url/avatar.jpg',
			provider: 'google',
		};
		render(<AuthButton />);
		const avatarButton = screen.getByLabelText('User menu');

		fireEvent.click(avatarButton);
		expect(screen.getByText('Test User')).toBeInTheDocument();

		fireEvent.click(avatarButton);
		expect(screen.queryByText('Test User')).not.toBeInTheDocument();
	});

	it('sets aria-expanded on avatar button', () => {
		mockUser = {
			displayName: 'Test User',
			email: 'test@example.com',
			photoURL: 'https://photo.url/avatar.jpg',
			provider: 'google',
		};
		render(<AuthButton />);
		const avatarButton = screen.getByLabelText('User menu');

		expect(avatarButton).toHaveAttribute('aria-expanded', 'false');
		fireEvent.click(avatarButton);
		expect(avatarButton).toHaveAttribute('aria-expanded', 'true');
	});
});
