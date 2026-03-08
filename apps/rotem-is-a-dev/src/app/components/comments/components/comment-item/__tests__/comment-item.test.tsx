import { fireEvent, render, screen } from '@testing-library/react';
import type { Timestamp } from 'firebase/firestore';
import type { Comment } from '../../../comments.types';

jest.mock('@/app/components/user-avatar', () => ({
	UserAvatar: ({ photoURL, displayName, provider, size }: {
		photoURL: Nullable<string>;
		displayName: Nullable<string>;
		provider: string;
		size?: number;
	}) => (
		<span
			data-testid="user-avatar"
			data-photo-url={photoURL}
			data-display-name={displayName}
			data-provider={provider}
			data-size={size}
		/>
	),
}));

jest.mock('../../../comments.helpers', () => ({
	formatRelativeTime: jest.fn(() => '5m ago'),
}));

import { CommentItem } from '../comment-item.component';

const mockComment: Comment = {
	id: 'comment-1',
	entityType: 'project',
	entityId: '1',
	userId: 'user-1',
	displayName: 'Jane Doe',
	photoURL: 'https://example.com/photo.jpg',
	provider: 'google',
	text: 'Great project!',
	createdAt: { toMillis: () => Date.now() } as Timestamp,
};

const mockOnDelete = jest.fn();

beforeEach(() => {
	jest.clearAllMocks();
});

describe('CommentItem', () => {
	it('renders the comment text', () => {
		render(<CommentItem comment={mockComment} isOwn={false} onDelete={mockOnDelete} />);
		expect(screen.getByText('Great project!')).toBeInTheDocument();
	});

	it('renders the display name', () => {
		render(<CommentItem comment={mockComment} isOwn={false} onDelete={mockOnDelete} />);
		expect(screen.getByText('Jane Doe')).toBeInTheDocument();
	});

	it('renders the user avatar with correct props', () => {
		render(<CommentItem comment={mockComment} isOwn={false} onDelete={mockOnDelete} />);
		const avatar = screen.getByTestId('user-avatar');
		expect(avatar).toHaveAttribute('data-photo-url', 'https://example.com/photo.jpg');
		expect(avatar).toHaveAttribute('data-display-name', 'Jane Doe');
		expect(avatar).toHaveAttribute('data-provider', 'google');
		expect(avatar).toHaveAttribute('data-size', '28');
	});

	it('renders the relative time', () => {
		render(<CommentItem comment={mockComment} isOwn={false} onDelete={mockOnDelete} />);
		expect(screen.getByTestId('comment-time')).toHaveTextContent('5m ago');
	});

	it('does not render delete button when not own comment', () => {
		render(<CommentItem comment={mockComment} isOwn={false} onDelete={mockOnDelete} />);
		expect(screen.queryByTestId('comment-delete')).not.toBeInTheDocument();
	});

	it('renders delete button when own comment', () => {
		render(<CommentItem comment={mockComment} isOwn={true} onDelete={mockOnDelete} />);
		expect(screen.getByTestId('comment-delete')).toBeInTheDocument();
	});

	it('calls onDelete with comment id when delete button is clicked', () => {
		render(<CommentItem comment={mockComment} isOwn={true} onDelete={mockOnDelete} />);
		fireEvent.click(screen.getByTestId('comment-delete'));
		expect(mockOnDelete).toHaveBeenCalledWith('comment-1');
	});

	it('renders delete button with correct aria-label', () => {
		render(<CommentItem comment={mockComment} isOwn={true} onDelete={mockOnDelete} />);
		expect(screen.getByTestId('comment-delete')).toHaveAttribute('aria-label', 'Delete comment');
	});

	it('renders as an article element', () => {
		render(<CommentItem comment={mockComment} isOwn={false} onDelete={mockOnDelete} />);
		expect(screen.getByTestId('comment-item').tagName).toBe('ARTICLE');
	});

	it('renders empty time when createdAt is null', () => {
		const commentWithoutTimestamp = { ...mockComment, createdAt: null } as unknown as Comment;
		render(<CommentItem comment={commentWithoutTimestamp} isOwn={false} onDelete={mockOnDelete} />);
		expect(screen.getByTestId('comment-time')).toHaveTextContent('');
	});
});
