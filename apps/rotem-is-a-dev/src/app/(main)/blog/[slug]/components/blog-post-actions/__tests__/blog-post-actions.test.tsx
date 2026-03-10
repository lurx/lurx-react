import { render, screen } from '@testing-library/react';
import type { Comment } from '@/app/components/comments/comments.types';
import {
	mockToggleStar,
	mockUseStars,
	mockUseComments,
	mockUseAuth,
	resetSocialMocks,
} from '@/app/__test-utils__/social-mocks';

jest.mock('@/app/components/comments/hooks', () => ({
	useStars: (...args: unknown[]) => require('@/app/__test-utils__/social-mocks').mockUseStars(...args),
	useComments: (...args: unknown[]) => require('@/app/__test-utils__/social-mocks').mockUseComments(...args),
}));

jest.mock('@/app/context/auth', () => ({
	useAuth: () => require('@/app/__test-utils__/social-mocks').mockUseAuth(),
}));

jest.mock('@/app/components/social-actions-bar', () =>
	require('@/app/__test-utils__/social-actions-bar.mock')
);

import { BlogPostActions } from '../blog-post-actions.component';

beforeEach(() => resetSocialMocks());

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
		const bar = screen.getByTestId('social-actions-bar');
		bar.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
		expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

		commentsSection.remove();
	});
});
