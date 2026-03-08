import { render, screen } from '@testing-library/react';
import type { Comment } from '@/app/components/comments/comments.types';

const mockToggleStar = jest.fn();

const mockUseStars = jest.fn(() => ({
	starCount: 0,
	hasUserStarred: false,
	isLoading: false,
	error: null as Nullable<string>,
	toggleStar: mockToggleStar,
}));

const mockUseComments = jest.fn(() => ({
	comments: [] as Comment[],
	isLoading: false,
	error: null as Nullable<string>,
	addComment: jest.fn(),
	deleteComment: jest.fn(),
}));

const mockUser = {
	uid: 'user-1',
	displayName: 'Test User',
	photoURL: 'https://example.com/photo.jpg',
	provider: 'google',
	email: 'test@example.com',
};

const mockUseAuth = jest.fn(() => ({
	user: mockUser,
	isLoading: false,
	signInWithGoogle: jest.fn(),
	signInWithGitHub: jest.fn(),
	signOut: jest.fn(),
}));

jest.mock('@/app/components/comments/hooks', () => ({
	useStars: (...args: unknown[]) => mockUseStars(...args),
	useComments: (...args: unknown[]) => mockUseComments(...args),
}));

jest.mock('@/app/context/auth', () => ({
	useAuth: () => mockUseAuth(),
}));

let capturedOnCommentClick: (() => void) | undefined;

jest.mock('@/app/components/social-actions-bar', () => ({
	SocialActionsBar: ({
		starCount,
		hasUserStarred,
		commentCount,
		hasUserCommented,
		isAuthenticated,
		onStarClick,
		onCommentClick,
	}: {
		starCount: number;
		hasUserStarred: boolean;
		commentCount: number;
		hasUserCommented: boolean;
		isAuthenticated: boolean;
		onStarClick: () => void;
		onCommentClick: () => void;
	}) => {
		capturedOnCommentClick = onCommentClick;
		return (
			<div
				data-testid="social-actions-bar"
				data-star-count={starCount}
				data-has-user-starred={hasUserStarred}
				data-comment-count={commentCount}
				data-has-user-commented={hasUserCommented}
				data-is-authenticated={isAuthenticated}
				onClick={onStarClick}
				onDoubleClick={onCommentClick}
			/>
		);
	},
}));

import { BlogPostActions } from '../blog-post-actions.component';

beforeEach(() => {
	jest.clearAllMocks();
	capturedOnCommentClick = undefined;
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
});

describe('BlogPostActions', () => {
	const defaultProps = {
		entityType: 'blog' as const,
		entityId: 'my-post',
	};

	it('renders the actions container', () => {
		render(<BlogPostActions {...defaultProps} />);
		expect(screen.getByTestId('blog-post-actions')).toBeInTheDocument();
	});

	it('calls useStars with correct arguments', () => {
		render(<BlogPostActions {...defaultProps} />);
		expect(mockUseStars).toHaveBeenCalledWith('blog', 'my-post');
	});

	it('calls useComments with correct arguments', () => {
		render(<BlogPostActions {...defaultProps} />);
		expect(mockUseComments).toHaveBeenCalledWith('blog', 'my-post');
	});

	it('passes star count to SocialActionsBar', () => {
		mockUseStars.mockReturnValue({
			starCount: 7,
			hasUserStarred: false,
			isLoading: false,
			error: null,
			toggleStar: mockToggleStar,
		});

		render(<BlogPostActions {...defaultProps} />);
		expect(screen.getByTestId('social-actions-bar')).toHaveAttribute('data-star-count', '7');
	});

	it('passes comment count to SocialActionsBar', () => {
		mockUseComments.mockReturnValue({
			comments: [
				{ id: 'c1', userId: 'user-2' },
				{ id: 'c2', userId: 'user-3' },
				{ id: 'c3', userId: 'user-4' },
			] as Comment[],
			isLoading: false,
			error: null,
			addComment: jest.fn(),
			deleteComment: jest.fn(),
		});

		render(<BlogPostActions {...defaultProps} />);
		expect(screen.getByTestId('social-actions-bar')).toHaveAttribute('data-comment-count', '3');
	});

	it('passes hasUserStarred to SocialActionsBar', () => {
		mockUseStars.mockReturnValue({
			starCount: 1,
			hasUserStarred: true,
			isLoading: false,
			error: null,
			toggleStar: mockToggleStar,
		});

		render(<BlogPostActions {...defaultProps} />);
		expect(screen.getByTestId('social-actions-bar')).toHaveAttribute('data-has-user-starred', 'true');
	});

	it('passes hasUserCommented to SocialActionsBar', () => {
		mockUseComments.mockReturnValue({
			comments: [{ id: 'c1', userId: 'user-1' }] as Comment[],
			isLoading: false,
			error: null,
			addComment: jest.fn(),
			deleteComment: jest.fn(),
		});

		render(<BlogPostActions {...defaultProps} />);
		expect(screen.getByTestId('social-actions-bar')).toHaveAttribute('data-has-user-commented', 'true');
	});

	it('passes hasUserCommented as false when user has not commented', () => {
		render(<BlogPostActions {...defaultProps} />);
		expect(screen.getByTestId('social-actions-bar')).toHaveAttribute('data-has-user-commented', 'false');
	});

	it('passes isAuthenticated as true when user is logged in', () => {
		render(<BlogPostActions {...defaultProps} />);
		expect(screen.getByTestId('social-actions-bar')).toHaveAttribute('data-is-authenticated', 'true');
	});

	it('passes isAuthenticated as false when user is not logged in', () => {
		mockUseAuth.mockReturnValue({
			user: null,
			isLoading: false,
			signInWithGoogle: jest.fn(),
			signInWithGitHub: jest.fn(),
			signOut: jest.fn(),
		});

		render(<BlogPostActions {...defaultProps} />);
		expect(screen.getByTestId('social-actions-bar')).toHaveAttribute('data-is-authenticated', 'false');
	});

	it('passes toggleStar as onStarClick', () => {
		render(<BlogPostActions {...defaultProps} />);
		screen.getByTestId('social-actions-bar').click();
		expect(mockToggleStar).toHaveBeenCalledTimes(1);
	});

	it('scrolls to comments section when onCommentClick is called', () => {
		const mockScrollIntoView = jest.fn();
		const commentsSection = document.createElement('section');
		commentsSection.id = 'comments';
		commentsSection.scrollIntoView = mockScrollIntoView;
		document.body.appendChild(commentsSection);

		render(<BlogPostActions {...defaultProps} />);
		capturedOnCommentClick?.();
		expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

		document.body.removeChild(commentsSection);
	});
});
