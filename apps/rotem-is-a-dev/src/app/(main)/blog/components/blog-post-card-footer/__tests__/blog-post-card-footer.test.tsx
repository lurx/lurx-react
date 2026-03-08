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
	}) => (
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
	),
}));

import { BlogPostCardFooter } from '../blog-post-card-footer.component';

beforeEach(() => {
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
});

describe('BlogPostCardFooter', () => {
	const defaultProps = {
		entityType: 'blog' as const,
		entityId: 'my-post',
		onCommentClick: jest.fn(),
	};

	it('renders the footer', () => {
		render(<BlogPostCardFooter {...defaultProps} />);
		expect(screen.getByTestId('blog-card-footer')).toBeInTheDocument();
	});

	it('calls useStars with correct arguments', () => {
		render(<BlogPostCardFooter {...defaultProps} />);
		expect(mockUseStars).toHaveBeenCalledWith('blog', 'my-post');
	});

	it('calls useComments with correct arguments', () => {
		render(<BlogPostCardFooter {...defaultProps} />);
		expect(mockUseComments).toHaveBeenCalledWith('blog', 'my-post');
	});

	it('passes star count to SocialActionsBar', () => {
		mockUseStars.mockReturnValue({
			starCount: 5,
			hasUserStarred: false,
			isLoading: false,
			error: null,
			toggleStar: mockToggleStar,
		});

		render(<BlogPostCardFooter {...defaultProps} />);
		expect(screen.getByTestId('social-actions-bar')).toHaveAttribute('data-star-count', '5');
	});

	it('passes comment count to SocialActionsBar', () => {
		mockUseComments.mockReturnValue({
			comments: [
				{ id: 'c1', userId: 'user-2' },
				{ id: 'c2', userId: 'user-3' },
			] as Comment[],
			isLoading: false,
			error: null,
			addComment: jest.fn(),
			deleteComment: jest.fn(),
		});

		render(<BlogPostCardFooter {...defaultProps} />);
		expect(screen.getByTestId('social-actions-bar')).toHaveAttribute('data-comment-count', '2');
	});

	it('passes hasUserStarred to SocialActionsBar', () => {
		mockUseStars.mockReturnValue({
			starCount: 1,
			hasUserStarred: true,
			isLoading: false,
			error: null,
			toggleStar: mockToggleStar,
		});

		render(<BlogPostCardFooter {...defaultProps} />);
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

		render(<BlogPostCardFooter {...defaultProps} />);
		expect(screen.getByTestId('social-actions-bar')).toHaveAttribute('data-has-user-commented', 'true');
	});

	it('passes hasUserCommented as false when user has not commented', () => {
		render(<BlogPostCardFooter {...defaultProps} />);
		expect(screen.getByTestId('social-actions-bar')).toHaveAttribute('data-has-user-commented', 'false');
	});

	it('passes isAuthenticated as true when user is logged in', () => {
		render(<BlogPostCardFooter {...defaultProps} />);
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

		render(<BlogPostCardFooter {...defaultProps} />);
		expect(screen.getByTestId('social-actions-bar')).toHaveAttribute('data-is-authenticated', 'false');
	});

	it('passes toggleStar as onStarClick', () => {
		render(<BlogPostCardFooter {...defaultProps} />);
		screen.getByTestId('social-actions-bar').click();
		expect(mockToggleStar).toHaveBeenCalledTimes(1);
	});

	it('passes onCommentClick to SocialActionsBar', () => {
		const onCommentClick = jest.fn();
		render(<BlogPostCardFooter {...defaultProps} onCommentClick={onCommentClick} />);
		const bar = screen.getByTestId('social-actions-bar');
		bar.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
		expect(onCommentClick).toHaveBeenCalledTimes(1);
	});
});
