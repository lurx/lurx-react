import { fireEvent, render, screen } from '@testing-library/react';
import type { Timestamp } from 'firebase/firestore';
import type { Comment } from '../comments.types';

const mockUser = {
	uid: 'user-1',
	displayName: 'Test User',
	photoURL: 'https://example.com/photo.jpg',
	provider: 'google',
	email: 'test@example.com',
};

const mockAddComment = jest.fn();
const mockDeleteComment = jest.fn();
const mockToggleStar = jest.fn();

const mockUseAuth = jest.fn((): {
	user: typeof mockUser | null;
	isLoading: boolean;
	signInWithGoogle: jest.Mock;
	signInWithGitHub: jest.Mock;
	signOut: jest.Mock;
} => ({
	user: mockUser,
	isLoading: false,
	signInWithGoogle: jest.fn(),
	signInWithGitHub: jest.fn(),
	signOut: jest.fn(),
}));

const mockUseComments = jest.fn((_entityType: string, _entityId: string) => ({
	comments: [] as Comment[],
	isLoading: false,
	error: null as Nullable<string>,
	addComment: mockAddComment,
	deleteComment: mockDeleteComment,
}));

const mockUseStars = jest.fn((_entityType: string, _entityId: string) => ({
	starCount: 0,
	hasUserStarred: false,
	isLoading: false,
	error: null as Nullable<string>,
	toggleStar: mockToggleStar,
}));

jest.mock('@/app/context/auth', () => ({
	useAuth: () => mockUseAuth(),
}));

jest.mock('../hooks', () => ({
	useComments: (entityType: string, entityId: string) => mockUseComments(entityType, entityId),
	useStars: (entityType: string, entityId: string) => mockUseStars(entityType, entityId),
}));

jest.mock('../components', () => ({
	CommentForm: ({ onSubmitAction }: { onSubmitAction: (text: string) => Promise<void> }) => (
		<button data-testid="comment-form" onClick={() => onSubmitAction('test')} />
	),
	CommentItem: ({ comment, isOwn, onDeleteAction }: {
		comment: Comment;
		isOwn: boolean;
		onDeleteAction: (id: string) => void;
	}) => (
		<button
			data-testid="comment-item"
			data-comment-id={comment.id}
			data-is-own={isOwn}
			onClick={() => onDeleteAction(comment.id)}
		>
			{comment.text}
		</button>
	),
	SignInPrompt: () => <div data-testid="sign-in-prompt" />,
}));

jest.mock('@/app/components/social-actions-bar', () =>
	require('@/app/__test-utils__/social-actions-bar.mock')
);

import { Comments } from '../comments.component';

const mockComments: Comment[] = [
	{
		id: 'c1',
		entityType: 'project',
		entityId: '1',
		userId: 'user-1',
		displayName: 'Test User',
		photoURL: null,
		provider: 'google',
		text: 'First comment',
		createdAt: { toMillis: () => Date.now() } as Timestamp,
	},
	{
		id: 'c2',
		entityType: 'project',
		entityId: '1',
		userId: 'user-2',
		displayName: 'Other User',
		photoURL: null,
		provider: 'github',
		text: 'Second comment',
		createdAt: { toMillis: () => Date.now() } as Timestamp,
	},
];

beforeEach(() => {
	jest.clearAllMocks();
	mockUseAuth.mockReturnValue({
		user: mockUser,
		isLoading: false,
		signInWithGoogle: jest.fn(),
		signInWithGitHub: jest.fn(),
		signOut: jest.fn(),
	});
	mockUseComments.mockReturnValue({
		comments: [],
		isLoading: false,
		error: null,
		addComment: mockAddComment,
		deleteComment: mockDeleteComment,
	});
	mockUseStars.mockReturnValue({
		starCount: 0,
		hasUserStarred: false,
		isLoading: false,
		error: null,
		toggleStar: mockToggleStar,
	});
});

describe('Comments', () => {
	it('renders the comments section', () => {
		render(<Comments entityType="project" entityId="1" />);
		expect(screen.getByTestId('comments-section')).toBeInTheDocument();
	});

	it('renders the comments section with the comments id', () => {
		render(<Comments entityType="project" entityId="1" />);
		expect(screen.getByTestId('comments-section')).toHaveAttribute('id', 'comments');
	});

	it('renders the heading', () => {
		render(<Comments entityType="project" entityId="1" />);
		expect(screen.getByText('Comments')).toBeInTheDocument();
	});

	it('calls useComments with correct arguments', () => {
		render(<Comments entityType="project" entityId="1" />);
		expect(mockUseComments).toHaveBeenCalledWith('project', '1');
	});

	it('calls useStars with correct arguments', () => {
		render(<Comments entityType="project" entityId="1" />);
		expect(mockUseStars).toHaveBeenCalledWith('project', '1');
	});

	it('shows loading state', () => {
		mockUseComments.mockReturnValue({
			comments: [],
			isLoading: true,
			error: null,
			addComment: mockAddComment,
			deleteComment: mockDeleteComment,
		});

		render(<Comments entityType="project" entityId="1" />);
		expect(screen.getByTestId('comments-loading')).toHaveTextContent('Loading comments...');
	});

	it('shows error state', () => {
		mockUseComments.mockReturnValue({
			comments: [],
			isLoading: false,
			error: 'Permission denied',
			addComment: mockAddComment,
			deleteComment: mockDeleteComment,
		});

		render(<Comments entityType="project" entityId="1" />);
		expect(screen.getByTestId('comments-error')).toHaveTextContent('Failed to load comments.');
	});

	it('shows empty state when no comments', () => {
		render(<Comments entityType="project" entityId="1" />);
		expect(screen.getByTestId('comments-empty')).toHaveTextContent(
			'No comments yet. Be the first to comment!',
		);
	});

	it('renders comment form when user is logged in', () => {
		render(<Comments entityType="project" entityId="1" />);
		expect(screen.getByTestId('comment-form')).toBeInTheDocument();
		expect(screen.queryByTestId('sign-in-prompt')).not.toBeInTheDocument();
	});

	it('renders sign-in prompt when user is not logged in', () => {
		mockUseAuth.mockReturnValue({
			user: null,
			isLoading: false,
			signInWithGoogle: jest.fn(),
			signInWithGitHub: jest.fn(),
			signOut: jest.fn(),
		});

		render(<Comments entityType="project" entityId="1" />);
		expect(screen.getByTestId('sign-in-prompt')).toBeInTheDocument();
		expect(screen.queryByTestId('comment-form')).not.toBeInTheDocument();
	});

	it('renders comments list with correct items', () => {
		mockUseComments.mockReturnValue({
			comments: mockComments,
			isLoading: false,
			error: null,
			addComment: mockAddComment,
			deleteComment: mockDeleteComment,
		});

		render(<Comments entityType="project" entityId="1" />);
		const items = screen.getAllByTestId('comment-item');
		expect(items).toHaveLength(2);
	});

	it('marks own comments as isOwn', () => {
		mockUseComments.mockReturnValue({
			comments: mockComments,
			isLoading: false,
			error: null,
			addComment: mockAddComment,
			deleteComment: mockDeleteComment,
		});

		render(<Comments entityType="project" entityId="1" />);
		const items = screen.getAllByTestId('comment-item');
		expect(items[0]).toHaveAttribute('data-is-own', 'true');
		expect(items[1]).toHaveAttribute('data-is-own', 'false');
	});

	it('shows comment count when there are comments', () => {
		mockUseComments.mockReturnValue({
			comments: mockComments,
			isLoading: false,
			error: null,
			addComment: mockAddComment,
			deleteComment: mockDeleteComment,
		});

		render(<Comments entityType="project" entityId="1" />);
		expect(screen.getByTestId('comments-count')).toHaveTextContent('(2)');
	});

	it('does not show comment count when loading', () => {
		mockUseComments.mockReturnValue({
			comments: [],
			isLoading: true,
			error: null,
			addComment: mockAddComment,
			deleteComment: mockDeleteComment,
		});

		render(<Comments entityType="project" entityId="1" />);
		expect(screen.queryByTestId('comments-count')).not.toBeInTheDocument();
	});

	it('does not show comment count when there is an error', () => {
		mockUseComments.mockReturnValue({
			comments: [],
			isLoading: false,
			error: 'Some error',
			addComment: mockAddComment,
			deleteComment: mockDeleteComment,
		});

		render(<Comments entityType="project" entityId="1" />);
		expect(screen.queryByTestId('comments-count')).not.toBeInTheDocument();
	});

	it('does not show comment count when no comments', () => {
		render(<Comments entityType="project" entityId="1" />);
		expect(screen.queryByTestId('comments-count')).not.toBeInTheDocument();
	});

	it('renders comments list container', () => {
		mockUseComments.mockReturnValue({
			comments: mockComments,
			isLoading: false,
			error: null,
			addComment: mockAddComment,
			deleteComment: mockDeleteComment,
		});

		render(<Comments entityType="project" entityId="1" />);
		expect(screen.getByTestId('comments-list')).toBeInTheDocument();
	});

	it('renders the social actions bar', () => {
		render(<Comments entityType="project" entityId="1" />);
		expect(screen.getByTestId('social-actions-bar')).toBeInTheDocument();
	});

	it('passes star data to social actions bar', () => {
		mockUseStars.mockReturnValue({
			starCount: 3,
			hasUserStarred: true,
			isLoading: false,
			error: null,
			toggleStar: mockToggleStar,
		});

		render(<Comments entityType="project" entityId="1" />);
		const bar = screen.getByTestId('social-actions-bar');
		expect(bar).toHaveAttribute('data-star-count', '3');
		expect(bar).toHaveAttribute('data-has-user-starred', 'true');
	});

	it('passes comment count to social actions bar', () => {
		mockUseComments.mockReturnValue({
			comments: mockComments,
			isLoading: false,
			error: null,
			addComment: mockAddComment,
			deleteComment: mockDeleteComment,
		});

		render(<Comments entityType="project" entityId="1" />);
		const bar = screen.getByTestId('social-actions-bar');
		expect(bar).toHaveAttribute('data-comment-count', '2');
	});

	it('sets hasUserCommented to true when user has commented', () => {
		mockUseComments.mockReturnValue({
			comments: mockComments,
			isLoading: false,
			error: null,
			addComment: mockAddComment,
			deleteComment: mockDeleteComment,
		});

		render(<Comments entityType="project" entityId="1" />);
		const bar = screen.getByTestId('social-actions-bar');
		expect(bar).toHaveAttribute('data-has-user-commented', 'true');
	});

	it('sets hasUserCommented to false when user has not commented', () => {
		mockUseComments.mockReturnValue({
			comments: [mockComments[1]],
			isLoading: false,
			error: null,
			addComment: mockAddComment,
			deleteComment: mockDeleteComment,
		});

		render(<Comments entityType="project" entityId="1" />);
		const bar = screen.getByTestId('social-actions-bar');
		expect(bar).toHaveAttribute('data-has-user-commented', 'false');
	});

	it('passes isAuthenticated as true when user is logged in', () => {
		render(<Comments entityType="project" entityId="1" />);
		const bar = screen.getByTestId('social-actions-bar');
		expect(bar).toHaveAttribute('data-is-authenticated', 'true');
	});

	it('passes isAuthenticated as false when user is not logged in', () => {
		mockUseAuth.mockReturnValue({
			user: null,
			isLoading: false,
			signInWithGoogle: jest.fn(),
			signInWithGitHub: jest.fn(),
			signOut: jest.fn(),
		});

		render(<Comments entityType="project" entityId="1" />);
		const bar = screen.getByTestId('social-actions-bar');
		expect(bar).toHaveAttribute('data-is-authenticated', 'false');
	});

	it('scrolls to heading when social actions bar comment is clicked', () => {
		const scrollIntoViewMock = jest.fn();
		HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

		render(<Comments entityType="project" entityId="1" />);
		fireEvent.doubleClick(screen.getByTestId('social-actions-bar'));
		expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
	});

	it('scrolls to heading when autoScrollToComments is true', () => {
		const scrollIntoViewMock = jest.fn();
		HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

		render(<Comments entityType="project" entityId="1" autoScrollToComments />);
		expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
	});
});
