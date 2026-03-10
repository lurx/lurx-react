import { fireEvent, render, screen } from '@testing-library/react';

const mockUser = {
	uid: '123',
	displayName: 'Test User',
	email: 'test@example.com',
	photoURL: 'https://photo.url/avatar.jpg',
	provider: 'google' as const,
};

jest.mock('@/app/context/auth', () => ({
	useAuth: () => ({ user: mockUser }),
}));

jest.mock('@/app/components', () => ({
	UserAvatar: ({ photoURL, displayName, provider }: { photoURL: string | null; displayName: string; provider: string }) => (
		<span data-testid="user-avatar" data-photo={photoURL} data-name={displayName} data-provider={provider} />
	),
}));

import { AuthAvatar } from '../auth-avatar.component';

const mockOnClick = jest.fn();

beforeEach(() => {
	jest.clearAllMocks();
});

describe('AuthAvatar', () => {
	it('renders a button with user avatar', () => {
		render(<AuthAvatar onClick={mockOnClick} />);
		expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
	});

	it('passes user props from context to UserAvatar', () => {
		render(<AuthAvatar onClick={mockOnClick} />);
		const avatar = screen.getByTestId('user-avatar');
		expect(avatar).toHaveAttribute('data-photo', 'https://photo.url/avatar.jpg');
		expect(avatar).toHaveAttribute('data-name', 'Test User');
		expect(avatar).toHaveAttribute('data-provider', 'google');
	});

	it('calls onClick when button is clicked', () => {
		render(<AuthAvatar onClick={mockOnClick} />);
		fireEvent.click(screen.getByRole('button'));
		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});

	it('sets aria-label to "User menu"', () => {
		render(<AuthAvatar onClick={mockOnClick} />);
		expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'User menu');
	});

	it('sets aria-expanded to false by default', () => {
		render(<AuthAvatar onClick={mockOnClick} />);
		expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
	});

	it('sets aria-expanded to true when isDropdownOpen is true', () => {
		render(<AuthAvatar isDropdownOpen={true} onClick={mockOnClick} />);
		expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
	});

	it('renders button with type="button"', () => {
		render(<AuthAvatar onClick={mockOnClick} />);
		expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
	});

	it('renders nothing when no user', () => {
		jest.resetModules();
		jest.doMock('@/app/context/auth', () => ({
			useAuth: () => ({ user: null }),
		}));
		jest.doMock('@/app/components', () => ({
			UserAvatar: () => <span data-testid="user-avatar" />,
		}));
		const { AuthAvatar: AuthAvatarFresh } = require('../auth-avatar.component');
		const { container } = render(<AuthAvatarFresh onClick={mockOnClick} />);
		expect(container).toBeEmptyDOMElement();
	});
});
