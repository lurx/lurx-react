import type { Comment } from '@/app/components/comments/comments.types';

export const mockToggleStar = jest.fn();

export const mockUseStars = jest.fn(() => ({
	starCount: 0,
	hasUserStarred: false,
	isLoading: false,
	error: null as Nullable<string>,
	toggleStar: mockToggleStar,
}));

export const mockUseComments = jest.fn(() => ({
	comments: [] as Comment[],
	isLoading: false,
	error: null as Nullable<string>,
	addComment: jest.fn(),
	deleteComment: jest.fn(),
}));

export const mockUser = {
	uid: 'user-1',
	displayName: 'Test User',
	photoURL: 'https://example.com/photo.jpg',
	provider: 'google',
	email: 'test@example.com',
};

export const mockUseAuth = jest.fn(() => ({
	user: mockUser,
	isLoading: false,
	signInWithGoogle: jest.fn(),
	signInWithGitHub: jest.fn(),
	signOut: jest.fn(),
}));

export const resetSocialMocks = () => {
	jest.clearAllMocks();
	mockUseAuth.mockReturnValue({
		user: mockUser,
		isLoading: false,
		signInWithGoogle: jest.fn(),
		signInWithGitHub: jest.fn(),
		signOut: jest.fn(),
	});
	mockUseStars.mockReturnValue({
		starCount: 0,
		hasUserStarred: false,
		isLoading: false,
		error: null,
		toggleStar: mockToggleStar,
	});
	mockUseComments.mockReturnValue({
		comments: [],
		isLoading: false,
		error: null,
		addComment: jest.fn(),
		deleteComment: jest.fn(),
	});
};
