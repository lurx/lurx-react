import { fireEvent, render, screen } from '@testing-library/react';
import type { Post } from '@/.velite';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
	useRouter: () => ({
		push: mockPush,
	}),
}));

jest.mock('../blog-page.helpers', () => ({
	filterPosts: jest.fn((posts: Post[]) => posts),
	getAllTags: jest.fn(() => ['react', 'typescript']),
}));

jest.mock('@/app/utils/toggle-in-array.util', () => ({
	toggleInArray: jest.fn((array: string[], item: string) =>
		array.includes(item) ? array.filter((el: string) => el !== item) : [...array, item],
	),
}));

jest.mock('@/app/components', () => ({
	FilterPanel: ({ children }: { children: React.ReactNode }) => (
		<aside data-testid="filter-panel">{children}</aside>
	),
	TechnologyFilter: ({
		technologies,
		selected,
		onToggle,
		sectionLabel,
	}: {
		technologies: string[];
		selected: string[];
		onToggle: (tag: string) => void;
		sectionLabel: string;
	}) => (
		<div data-testid="technology-filter">
			<span>{sectionLabel}</span>
			{technologies.map((tech: string) => (
				<button key={tech} onClick={() => onToggle(tech)} aria-pressed={selected.includes(tech)}>
					{tech}
				</button>
			))}
		</div>
	),
	TextInput: ({
		label,
		value,
		onChange,
		placeholder,
	}: {
		label: string;
		value: string;
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
		placeholder: string;
	}) => (
		<input
			aria-label={label}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
		/>
	),
}));

jest.mock('../components/blog-post-card.component', () => ({
	BlogPostCard: ({ post, onCommentClick }: { post: Post; onCommentClick?: (post: Post) => void }) => (
		<li data-testid={`post-card-${post.slug}`}>
			{post.title}
			{onCommentClick && (
				<button data-testid={`comment-click-${post.slug}`} onClick={() => onCommentClick(post)}>
					comment
				</button>
			)}
		</li>
	),
}));

jest.mock('@/app/components/empty-state', () => ({
	EmptyState: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="empty-state">{children}</div>
	),
	EMPTY_STATE_VARIANTS: { NO_POSTS: 'NO_POSTS' },
}));

import { filterPosts, getAllTags } from '../blog-page.helpers';
import { BlogPage } from '../blog-page.component';

const mockFilterPosts = filterPosts as jest.Mock;
const mockGetAllTags = getAllTags as jest.Mock;

const makeMockPost = (overrides: Partial<Post> = {}): Post => ({
	slug: 'my-post',
	title: 'My Post',
	description: 'A description.',
	tags: ['react'],
	date: '2025-01-01',
	draft: false,
	content: '<p>Content</p>',
	metadata: { readingTime: 3, wordCount: 600 },
	...overrides,
});

const POSTS: Post[] = [
	makeMockPost({ slug: 'post-one', title: 'Post One' }),
	makeMockPost({ slug: 'post-two', title: 'Post Two', tags: ['typescript'] }),
];

beforeEach(() => {
	jest.clearAllMocks();
	mockFilterPosts.mockImplementation((posts: Post[]) => posts);
	mockGetAllTags.mockReturnValue(['react', 'typescript']);
});

describe('BlogPage', () => {
	it('renders the filter panel', () => {
		render(<BlogPage posts={POSTS} />);
		expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
	});

	it('renders the search input', () => {
		render(<BlogPage posts={POSTS} />);
		expect(screen.getByPlaceholderText('Search posts...')).toBeInTheDocument();
	});

	it('renders the technology filter with the tags label', () => {
		render(<BlogPage posts={POSTS} />);
		expect(screen.getByText('tags')).toBeInTheDocument();
	});

	it('renders the technology filter with all available tags', () => {
		render(<BlogPage posts={POSTS} />);
		expect(screen.getByText('react')).toBeInTheDocument();
		expect(screen.getByText('typescript')).toBeInTheDocument();
	});

	it('renders a card for each post', () => {
		render(<BlogPage posts={POSTS} />);
		expect(screen.getByTestId('post-card-post-one')).toBeInTheDocument();
		expect(screen.getByTestId('post-card-post-two')).toBeInTheDocument();
	});

	it('renders NoPosts when filterPosts returns empty array', () => {
		mockFilterPosts.mockReturnValue([]);
		render(<BlogPage posts={POSTS} />);
		expect(screen.getByTestId('empty-state')).toBeInTheDocument();
	});

	it('does not render NoPosts when posts are present', () => {
		render(<BlogPage posts={POSTS} />);
		expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
	});

	it('calls getAllTags with the posts on mount', () => {
		render(<BlogPage posts={POSTS} />);
		expect(mockGetAllTags).toHaveBeenCalledWith(POSTS);
	});

	it('calls filterPosts with posts, selected tags, and search term', () => {
		render(<BlogPage posts={POSTS} />);
		expect(mockFilterPosts).toHaveBeenCalledWith(POSTS, [], '');
	});

	it('updates search value when typing in the search input', () => {
		render(<BlogPage posts={POSTS} />);
		const input = screen.getByPlaceholderText('Search posts...') as HTMLInputElement;
		fireEvent.change(input, { target: { value: 'hello' } });
		expect(input.value).toBe('hello');
	});

	it('passes updated search term to filterPosts after typing', () => {
		render(<BlogPage posts={POSTS} />);
		const input = screen.getByPlaceholderText('Search posts...');
		fireEvent.change(input, { target: { value: 'react' } });
		expect(mockFilterPosts).toHaveBeenCalledWith(POSTS, [], 'react');
	});

	it('toggles a tag into selectedTags when a tag button is clicked', () => {
		render(<BlogPage posts={POSTS} />);
		fireEvent.click(screen.getByRole('button', { name: 'react' }));
		expect(mockFilterPosts).toHaveBeenCalledWith(POSTS, ['react'], expect.any(String));
	});

	it('removes a tag from selectedTags when clicked again', () => {
		render(<BlogPage posts={POSTS} />);
		const reactButton = screen.getByRole('button', { name: 'react' });
		fireEvent.click(reactButton);
		fireEvent.click(reactButton);
		expect(mockFilterPosts).toHaveBeenLastCalledWith(POSTS, [], expect.any(String));
	});

	it('renders with an empty posts array without errors', () => {
		mockFilterPosts.mockReturnValue([]);
		mockGetAllTags.mockReturnValue([]);
		render(<BlogPage posts={[]} />);
		expect(screen.getByTestId('empty-state')).toBeInTheDocument();
	});

	it('passes onCommentClick to blog post cards', () => {
		render(<BlogPage posts={POSTS} />);
		expect(screen.getByTestId('comment-click-post-one')).toBeInTheDocument();
	});

	it('navigates to blog post when comment is clicked', () => {
		render(<BlogPage posts={POSTS} />);
		fireEvent.click(screen.getByTestId('comment-click-post-one'));
		expect(mockPush).toHaveBeenCalledWith('/blog/post-one');
	});
});
