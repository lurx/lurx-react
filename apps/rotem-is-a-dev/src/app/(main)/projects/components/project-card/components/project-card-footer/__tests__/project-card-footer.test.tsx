import { fireEvent, render, screen } from '@testing-library/react';
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

jest.mock('@/app/components/fa-icon', () => ({
	FaIcon: ({ iconName, iconGroup }: { iconName: string; iconGroup: string }) => (
		<span data-testid={`fa-icon-${iconName}`} data-icon-group={iconGroup} />
	),
}));

jest.mock('@/app/components/sign-in-dialog', () => ({
	SignInDialog: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
		isOpen ? (
			<div data-testid="sign-in-dialog">
				<button type="button" onClick={onClose} data-testid="close-dialog">close</button>
			</div>
		) : null,
}));

import { ProjectCardFooter } from '../project-card-footer.component';

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

describe('ProjectCardFooter', () => {
	const defaultProps = {
		entityType: 'project' as const,
		entityId: '1',
		onCommentClick: jest.fn(),
	};

	it('renders the footer', () => {
		render(<ProjectCardFooter {...defaultProps} />);
		expect(screen.getByTestId('project-card-footer')).toBeInTheDocument();
	});

	it('calls useStars with correct arguments', () => {
		render(<ProjectCardFooter {...defaultProps} />);
		expect(mockUseStars).toHaveBeenCalledWith('project', '1');
	});

	it('calls useComments with correct arguments', () => {
		render(<ProjectCardFooter {...defaultProps} />);
		expect(mockUseComments).toHaveBeenCalledWith('project', '1');
	});

	it('displays star count', () => {
		mockUseStars.mockReturnValue({
			starCount: 5,
			hasUserStarred: false,
			isLoading: false,
			error: null,
			toggleStar: mockToggleStar,
		});

		render(<ProjectCardFooter {...defaultProps} />);
		expect(screen.getByTestId('card-star-count')).toHaveTextContent('5');
	});

	it('displays comment count', () => {
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

		render(<ProjectCardFooter {...defaultProps} />);
		expect(screen.getByTestId('card-comment-count')).toHaveTextContent('2');
	});

	it('uses light star icon when not starred', () => {
		render(<ProjectCardFooter {...defaultProps} />);
		expect(screen.getByTestId('fa-icon-star')).toHaveAttribute('data-icon-group', 'fal');
	});

	it('uses solid star icon when starred', () => {
		mockUseStars.mockReturnValue({
			starCount: 1,
			hasUserStarred: true,
			isLoading: false,
			error: null,
			toggleStar: mockToggleStar,
		});

		render(<ProjectCardFooter {...defaultProps} />);
		expect(screen.getByTestId('fa-icon-star')).toHaveAttribute('data-icon-group', 'fas');
	});

	it('uses light comment icon when user has not commented', () => {
		render(<ProjectCardFooter {...defaultProps} />);
		expect(screen.getByTestId('fa-icon-comment')).toHaveAttribute('data-icon-group', 'fal');
	});

	it('uses solid comment icon when user has commented', () => {
		mockUseComments.mockReturnValue({
			comments: [{ id: 'c1', userId: 'user-1' }] as Comment[],
			isLoading: false,
			error: null,
			addComment: jest.fn(),
			deleteComment: jest.fn(),
		});

		render(<ProjectCardFooter {...defaultProps} />);
		expect(screen.getByTestId('fa-icon-comment')).toHaveAttribute('data-icon-group', 'fas');
	});

	it('calls toggleStar when authenticated user clicks star', () => {
		render(<ProjectCardFooter {...defaultProps} />);
		fireEvent.click(screen.getByTestId('card-star-button'));
		expect(mockToggleStar).toHaveBeenCalledTimes(1);
	});

	it('opens sign-in dialog when unauthenticated user clicks star', () => {
		mockUseAuth.mockReturnValue({
			user: null,
			isLoading: false,
			signInWithGoogle: jest.fn(),
			signInWithGitHub: jest.fn(),
			signOut: jest.fn(),
		});

		render(<ProjectCardFooter {...defaultProps} />);
		fireEvent.click(screen.getByTestId('card-star-button'));
		expect(mockToggleStar).not.toHaveBeenCalled();
		expect(screen.getByTestId('sign-in-dialog')).toBeInTheDocument();
	});

	it('closes sign-in dialog when close is triggered', () => {
		mockUseAuth.mockReturnValue({
			user: null,
			isLoading: false,
			signInWithGoogle: jest.fn(),
			signInWithGitHub: jest.fn(),
			signOut: jest.fn(),
		});

		render(<ProjectCardFooter {...defaultProps} />);
		fireEvent.click(screen.getByTestId('card-star-button'));
		fireEvent.click(screen.getByTestId('close-dialog'));
		expect(screen.queryByTestId('sign-in-dialog')).not.toBeInTheDocument();
	});

	it('calls onCommentClick when comment button is clicked', () => {
		const onCommentClick = jest.fn();
		render(<ProjectCardFooter {...defaultProps} onCommentClick={onCommentClick} />);
		fireEvent.click(screen.getByTestId('card-comment-button'));
		expect(onCommentClick).toHaveBeenCalledTimes(1);
	});

	it('renders view-project button when onViewClick is provided', () => {
		const onViewClick = jest.fn();
		render(<ProjectCardFooter {...defaultProps} onViewClick={onViewClick} />);
		expect(screen.getByTestId('card-view-button')).toBeInTheDocument();
	});

	it('does not render view-project button without onViewClick', () => {
		render(<ProjectCardFooter {...defaultProps} />);
		expect(screen.queryByTestId('card-view-button')).not.toBeInTheDocument();
	});

	it('calls onViewClick when view-project button is clicked', () => {
		const onViewClick = jest.fn();
		render(<ProjectCardFooter {...defaultProps} onViewClick={onViewClick} />);
		fireEvent.click(screen.getByTestId('card-view-button'));
		expect(onViewClick).toHaveBeenCalledTimes(1);
	});
});
