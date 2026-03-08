import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
	onAuthStateChanged,
	signInWithPopup,
	signOut as firebaseSignOut,
} from 'firebase/auth';

jest.mock('firebase/auth', () => ({
	getAuth: jest.fn(),
	onAuthStateChanged: jest.fn(),
	signInWithPopup: jest.fn(),
	signOut: jest.fn(),
	GoogleAuthProvider: jest.fn(),
	GithubAuthProvider: jest.fn(),
}));

jest.mock('@/lib/firebase', () => ({
	auth: {},
	db: {},
}));

const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;
const mockSignInWithPopup = signInWithPopup as jest.Mock;
const mockSignOut = firebaseSignOut as jest.Mock;

import { AuthProvider, useAuth } from '../auth.context';

const TestConsumer = () => {
	const { user, isLoading, signInWithGoogle, signInWithGitHub, signOut } =
		useAuth();

	return (
		<div>
			<span data-testid="loading">{String(isLoading)}</span>
			<span data-testid="user">{user ? user.displayName : 'null'}</span>
			<span data-testid="provider">{user ? user.provider : 'none'}</span>
			<button onClick={signInWithGoogle}>Google</button>
			<button onClick={signInWithGitHub}>GitHub</button>
			<button onClick={signOut}>Sign out</button>
		</div>
	);
};

const renderWithProvider = () =>
	render(
		<AuthProvider>
			<TestConsumer />
		</AuthProvider>,
	);

beforeEach(() => {
	jest.clearAllMocks();
	mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
		callback(null);
		return jest.fn();
	});
	mockSignInWithPopup.mockResolvedValue({});
	mockSignOut.mockResolvedValue(undefined);
});

describe('AuthProvider', () => {
	it('starts with isLoading true before auth state resolves', () => {
		mockOnAuthStateChanged.mockImplementation(() => jest.fn());
		renderWithProvider();
		expect(screen.getByTestId('loading')).toHaveTextContent('true');
	});

	it('sets user to null when no user is signed in', () => {
		renderWithProvider();
		expect(screen.getByTestId('user')).toHaveTextContent('null');
		expect(screen.getByTestId('loading')).toHaveTextContent('false');
	});

	it('sets user when a Google user is signed in', () => {
		mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
			callback({
				uid: '123',
				displayName: 'Test User',
				email: 'test@example.com',
				photoURL: 'https://photo.url',
				providerData: [{ providerId: 'google.com' }],
			});
			return jest.fn();
		});

		renderWithProvider();
		expect(screen.getByTestId('user')).toHaveTextContent('Test User');
		expect(screen.getByTestId('provider')).toHaveTextContent('google');
	});

	it('sets provider to github for GitHub users', () => {
		mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
			callback({
				uid: '456',
				displayName: 'GH User',
				email: 'gh@example.com',
				photoURL: null,
				providerData: [{ providerId: 'github.com' }],
			});
			return jest.fn();
		});

		renderWithProvider();
		expect(screen.getByTestId('provider')).toHaveTextContent('github');
	});

	it('calls signInWithPopup when signInWithGoogle is called', async () => {
		renderWithProvider();
		fireEvent.click(screen.getByText('Google'));
		await waitFor(() => {
			expect(mockSignInWithPopup).toHaveBeenCalledTimes(1);
		});
	});

	it('calls signInWithPopup when signInWithGitHub is called', async () => {
		renderWithProvider();
		fireEvent.click(screen.getByText('GitHub'));
		await waitFor(() => {
			expect(mockSignInWithPopup).toHaveBeenCalledTimes(1);
		});
	});

	it('calls firebase signOut when signOut is called', async () => {
		renderWithProvider();
		fireEvent.click(screen.getByText('Sign out'));
		await waitFor(() => {
			expect(mockSignOut).toHaveBeenCalledTimes(1);
		});
	});

	it('unsubscribes from auth state on unmount', () => {
		const unsubscribe = jest.fn();
		mockOnAuthStateChanged.mockReturnValue(unsubscribe);

		const { unmount } = renderWithProvider();
		unmount();

		expect(unsubscribe).toHaveBeenCalledTimes(1);
	});
});

describe('useAuth', () => {
	it('throws when used outside AuthProvider', () => {
		const spy = jest.spyOn(console, 'error').mockImplementation(jest.fn());

		expect(() => render(<TestConsumer />)).toThrow(
			'useAuth must be used within AuthProvider',
		);

		spy.mockRestore();
	});
});
