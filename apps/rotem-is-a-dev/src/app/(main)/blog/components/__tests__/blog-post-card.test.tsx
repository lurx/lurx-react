import { fireEvent, render, screen } from '@testing-library/react';
import type { Post } from '@/.velite';

jest.mock('@/app/(main)/blog/blog-page.helpers', () => ({
	formatDate: (date: string) => `Formatted: ${date}`,
}));

jest.mock('@/app/(main)/blog/components/blog-tags', () => ({
	BlogTagsList: ({ tags }: { tags: string[] }) => (
		<div data-testid="blog-tags-list">{tags.join(', ')}</div>
	),
}));

jest.mock('@/app/(main)/blog/components/blog-post-card-footer', () => ({
	BlogPostCardFooter: ({
		entityType,
		entityId,
		onCommentClick,
	}: {
		entityType: string;
		entityId: string;
		onCommentClick: () => void;
	}) => (
		<div
			data-testid="blog-card-footer"
			data-entity-type={entityType}
			data-entity-id={entityId}
			onClick={onCommentClick}
		/>
	),
}));

import { BlogPostCard } from '../blog-post-card.component';

const mockPost: Post = {
	slug: 'test-post',
	title: 'Test Post Title',
	description: 'A test post description.',
	tags: ['react', 'typescript'],
	date: '2025-01-15',
	draft: false,
	content: '<p>Content</p>',
	metadata: { readingTime: 5, wordCount: 1000 },
};

describe('BlogPostCard', () => {
	it('renders the post title', () => {
		render(<BlogPostCard post={mockPost} />);
		expect(screen.getByText('Test Post Title')).toBeInTheDocument();
	});

	it('renders the post description', () => {
		render(<BlogPostCard post={mockPost} />);
		expect(screen.getByText('A test post description.')).toBeInTheDocument();
	});

	it('renders a link to the post', () => {
		render(<BlogPostCard post={mockPost} />);
		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', '/blog/test-post');
	});

	it('renders the formatted date', () => {
		render(<BlogPostCard post={mockPost} />);
		expect(screen.getByText('Formatted: 2025-01-15')).toBeInTheDocument();
	});

	it('renders the date inside a time element with the dateTime attribute', () => {
		render(<BlogPostCard post={mockPost} />);
		const time = screen.getByText('Formatted: 2025-01-15').closest('time');
		expect(time).toHaveAttribute('dateTime', '2025-01-15');
	});

	it('renders the reading time', () => {
		render(<BlogPostCard post={mockPost} />);
		expect(screen.getByText('5 min read')).toBeInTheDocument();
	});

	it('renders the tags list', () => {
		render(<BlogPostCard post={mockPost} />);
		expect(screen.getByTestId('blog-tags-list')).toBeInTheDocument();
	});

	it('passes the post tags to BlogTagsList', () => {
		render(<BlogPostCard post={mockPost} />);
		expect(screen.getByTestId('blog-tags-list')).toHaveTextContent('react, typescript');
	});

	it('renders as a list item', () => {
		const { container } = render(<BlogPostCard post={mockPost} />);
		expect(container.firstChild?.nodeName).toBe('LI');
	});

	it('renders the card title as an h2', () => {
		render(<BlogPostCard post={mockPost} />);
		expect(screen.getByRole('heading', { level: 2, name: 'Test Post Title' })).toBeInTheDocument();
	});

	describe('with onCommentClick', () => {
		it('renders the footer when onCommentClick is provided', () => {
			const onCommentClick = jest.fn();
			render(<BlogPostCard post={mockPost} onCommentClick={onCommentClick} />);
			expect(screen.getByTestId('blog-card-footer')).toBeInTheDocument();
		});

		it('does not render footer without onCommentClick', () => {
			render(<BlogPostCard post={mockPost} />);
			expect(screen.queryByTestId('blog-card-footer')).not.toBeInTheDocument();
		});

		it('passes correct entityType and entityId to footer', () => {
			const onCommentClick = jest.fn();
			render(<BlogPostCard post={mockPost} onCommentClick={onCommentClick} />);
			const footer = screen.getByTestId('blog-card-footer');
			expect(footer).toHaveAttribute('data-entity-type', 'blog');
			expect(footer).toHaveAttribute('data-entity-id', 'test-post');
		});

		it('calls onCommentClick with the post when footer comment is clicked', () => {
			const onCommentClick = jest.fn();
			render(<BlogPostCard post={mockPost} onCommentClick={onCommentClick} />);
			fireEvent.click(screen.getByTestId('blog-card-footer'));
			expect(onCommentClick).toHaveBeenCalledWith(mockPost);
		});
	});
});
