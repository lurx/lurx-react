import { render, screen } from '@testing-library/react';
import { BlogPostHeader } from '../blog-post-header.component';
import type { Post } from '@/.velite';

jest.mock('@/app/(main)/blog/blog-page.helpers', () => ({
	formatDate: (date: string) => `Formatted: ${date}`,
}));

jest.mock('@/app/(main)/blog/components', () => ({
	BlogTagsList: ({ tags }: { tags: string[] }) => (
		<div data-testid="blog-tags-list">{tags.join(', ')}</div>
	),
}));

const mockPost: Post = {
	slug: 'my-blog-post',
	title: 'My Blog Post',
	description: 'A great blog post.',
	tags: ['react', 'typescript'],
	date: '2025-03-01',
	draft: false,
	content: '<p>Content here</p>',
	metadata: { readingTime: 7, wordCount: 1400 },
};

describe('BlogPostHeader', () => {
	it('renders the post title', () => {
		render(<BlogPostHeader post={mockPost} />);
		expect(screen.getByRole('heading', { level: 1, name: 'My Blog Post' })).toBeInTheDocument();
	});

	it('renders the formatted date', () => {
		render(<BlogPostHeader post={mockPost} />);
		expect(screen.getByText('Formatted: 2025-03-01')).toBeInTheDocument();
	});

	it('renders the date inside a time element with the correct dateTime attribute', () => {
		render(<BlogPostHeader post={mockPost} />);
		const time = screen.getByText('Formatted: 2025-03-01').closest('time');
		expect(time).toHaveAttribute('dateTime', '2025-03-01');
	});

	it('renders the reading time', () => {
		render(<BlogPostHeader post={mockPost} />);
		expect(screen.getByText('7 min read')).toBeInTheDocument();
	});

	it('renders the tags list', () => {
		render(<BlogPostHeader post={mockPost} />);
		expect(screen.getByTestId('blog-tags-list')).toBeInTheDocument();
	});

	it('passes the post tags to BlogTagsList', () => {
		render(<BlogPostHeader post={mockPost} />);
		expect(screen.getByTestId('blog-tags-list')).toHaveTextContent('react, typescript');
	});

	it('renders inside a header element', () => {
		const { container } = render(<BlogPostHeader post={mockPost} />);
		expect(container.firstChild?.nodeName).toBe('HEADER');
	});

	it('renders with a different reading time', () => {
		const post: Post = { ...mockPost, metadata: { readingTime: 12, wordCount: 2400 } };
		render(<BlogPostHeader post={post} />);
		expect(screen.getByText('12 min read')).toBeInTheDocument();
	});

	it('renders with no tags correctly', () => {
		const post: Post = { ...mockPost, tags: [] };
		render(<BlogPostHeader post={post} />);
		expect(screen.getByTestId('blog-tags-list')).toHaveTextContent('');
	});
});
