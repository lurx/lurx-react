import { render, screen } from '@testing-library/react';
import { BlogSeriesCard } from '../blog-series-card.component';
import type { SeriesMeta } from '../../../data/blog-series.types';

const mockMeta: SeriesMeta = {
	slug: 'test-series',
	title: 'Test Series Title',
	description: 'A test series description.',
};

const makePost = (slug: string, order: number, overrides: Record<string, unknown> = {}) => ({
	slug,
	title: `Part ${order} Title`,
	description: `Part ${order} description`,
	tags: ['test'],
	date: '2024-01-01',
	content: '',
	series: 'test-series',
	seriesOrder: order,
	draft: false,
	metadata: { readingTime: 5 },
	...overrides,
});

describe('BlogSeriesCard', () => {
	const posts = [makePost('part-1', 1), makePost('part-2', 2), makePost('part-3', 3)] as never[];

	it('renders the series title', () => {
		render(<BlogSeriesCard meta={mockMeta} posts={posts} />);

		expect(screen.getByText('Test Series Title')).toBeInTheDocument();
	});

	it('renders the series description', () => {
		render(<BlogSeriesCard meta={mockMeta} posts={posts} />);

		expect(screen.getByText('A test series description.')).toBeInTheDocument();
	});

	it('renders the latest date from posts', () => {
		const postsWithDates = [
			makePost('part-1', 1, { date: '2024-01-01' }),
			makePost('part-2', 2, { date: '2024-03-15' }),
		] as never[];

		render(<BlogSeriesCard meta={mockMeta} posts={postsWithDates} />);

		expect(screen.getByText('March 15, 2024')).toBeInTheDocument();
	});

	it('renders the parts count', () => {
		render(<BlogSeriesCard meta={mockMeta} posts={posts} />);

		expect(screen.getByText('3 parts')).toBeInTheDocument();
	});

	it('renders a mini card for each post', () => {
		render(<BlogSeriesCard meta={mockMeta} posts={posts} />);

		expect(screen.getByText('Part 1 Title')).toBeInTheDocument();
		expect(screen.getByText('Part 2 Title')).toBeInTheDocument();
		expect(screen.getByText('Part 3 Title')).toBeInTheDocument();
	});

	it('renders part number badges', () => {
		render(<BlogSeriesCard meta={mockMeta} posts={posts} />);

		expect(screen.getByText('Part 1')).toBeInTheDocument();
		expect(screen.getByText('Part 2')).toBeInTheDocument();
		expect(screen.getByText('Part 3')).toBeInTheDocument();
	});

	it('renders reading time for each mini card', () => {
		render(<BlogSeriesCard meta={mockMeta} posts={posts} />);

		const readingTimes = screen.getAllByText('5 min read');

		expect(readingTimes).toHaveLength(3);
	});

	it('links each mini card to its post page', () => {
		render(<BlogSeriesCard meta={mockMeta} posts={posts} />);

		const links = screen.getAllByRole('link');

		expect(links[0]).toHaveAttribute('href', '/blog/part-1');
		expect(links[1]).toHaveAttribute('href', '/blog/part-2');
		expect(links[2]).toHaveAttribute('href', '/blog/part-3');
	});

	it('renders shared tags at series level and unique tags on mini cards', () => {
		const postsWithTags = [
			makePost('part-1', 1, { tags: ['ai', 'llm', 'react'] }),
			makePost('part-2', 2, { tags: ['ai', 'llm', 'scss'] }),
		] as never[];

		render(<BlogSeriesCard meta={mockMeta} posts={postsWithTags} />);

		expect(screen.getAllByText('ai')).toHaveLength(1);
		expect(screen.getAllByText('llm')).toHaveLength(1);
		expect(screen.getByText('react')).toBeInTheDocument();
		expect(screen.getByText('scss')).toBeInTheDocument();
	});

	it('shows draft tag when any post is a draft', () => {
		const postsWithDraft = [
			makePost('part-1', 1, { draft: true }),
			makePost('part-2', 2, { draft: false }),
		] as never[];

		render(<BlogSeriesCard meta={mockMeta} posts={postsWithDraft} />);

		expect(screen.getByText('draft')).toBeInTheDocument();
	});
});
