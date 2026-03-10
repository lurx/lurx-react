import { fireEvent, render, screen } from '@testing-library/react';

let mockUser: { displayName: string; email: string; photoURL: string | null; provider: string } | null = null;
let mockIsLoading = false;
const mockSignInWithGoogle = jest.fn();
const mockSignOut = jest.fn();
const mockDeleteUser = jest.fn();

jest.mock('@/app/context/auth', () => ({
	useAuth: () => ({
		user: mockUser,
		isLoading: mockIsLoading,
		signInWithGoogle: mockSignInWithGoogle,
		signInWithGitHub: jest.fn(),
		signOut: mockSignOut,
		deleteUser: mockDeleteUser,
	}),
}));

jest.mock('@/hooks', () => ({
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

jest.mock('@/app/components/user-settings-dialog', () => ({
	UserSettingsDialog: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
		isOpen ? <button data-testid="user-settings-dialog" onClick={onClose} /> : null,
}));

import { AuthButton } from '../auth-button.component';

beforeEach(() => {
	jest.clearAllMocks();
	mockUser = null;
	mockIsLoading = false;
});

describe('AuthButton', () => {
	it('returns null when loading', () => {
		mockIsLoading = true;
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
		expect(screen.getByText('Settings')).toBeInTheDocument();
		expect(screen.getByText('Sign out')).toBeInTheDocument();
	});

	it('shows settings and sign out menu items in dropdown', () => {
		mockUser = {
			displayName: 'Test User',
			email: 'test@example.com',
			photoURL: 'https://photo.url/avatar.jpg',
			provider: 'google',
		};
		render(<AuthButton />);
		fireEvent.click(screen.getByLabelText('User menu'));
		const menuItems = screen.getAllByRole('menuitem');
		expect(menuItems).toHaveLength(2);
		expect(menuItems[0]).toHaveTextContent('Settings');
		expect(menuItems[1]).toHaveTextContent('Sign out');
	});

	it('calls signOut when sign out menu item is clicked', () => {
		mockUser = {
			displayName: 'Test User',
			email: 'test@example.com',
			photoURL: 'https://photo.url/avatar.jpg',
			provider: 'google',
		};
		render(<AuthButton />);
		fireEvent.click(screen.getByLabelText('User menu'));
		fireEvent.click(screen.getByText('Sign out'));
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
		expect(screen.getByText('Settings')).toBeInTheDocument();
		fireEvent.click(screen.getByText('Sign out'));
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('opens settings dialog when Settings menu item is clicked', () => {
		mockUser = {
			displayName: 'Test User',
			email: 'test@example.com',
			photoURL: 'https://photo.url/avatar.jpg',
			provider: 'google',
		};
		render(<AuthButton />);
		fireEvent.click(screen.getByLabelText('User menu'));
		fireEvent.click(screen.getByText('Settings'));
		expect(screen.getByTestId('user-settings-dialog')).toBeInTheDocument();
	});

	it('closes dropdown when settings dialog is opened', () => {
		mockUser = {
			displayName: 'Test User',
			email: 'test@example.com',
			photoURL: 'https://photo.url/avatar.jpg',
			provider: 'google',
		};
		render(<AuthButton />);
		fireEvent.click(screen.getByLabelText('User menu'));
		fireEvent.click(screen.getByText('Settings'));
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('closes settings dialog when onClose is called', () => {
		mockUser = {
			displayName: 'Test User',
			email: 'test@example.com',
			photoURL: 'https://photo.url/avatar.jpg',
			provider: 'google',
		};
		render(<AuthButton />);
		fireEvent.click(screen.getByLabelText('User menu'));
		fireEvent.click(screen.getByText('Settings'));
		expect(screen.getByTestId('user-settings-dialog')).toBeInTheDocument();
		fireEvent.click(screen.getByTestId('user-settings-dialog'));
		expect(screen.queryByTestId('user-settings-dialog')).not.toBeInTheDocument();
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
		expect(screen.getByText('Settings')).toBeInTheDocument();

		fireEvent.click(avatarButton);
		expect(screen.queryByText('Settings')).not.toBeInTheDocument();
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
