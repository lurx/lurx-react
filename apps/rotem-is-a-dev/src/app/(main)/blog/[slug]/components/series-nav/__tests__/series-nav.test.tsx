import { render, screen } from '@testing-library/react';
import { SeriesNav } from '../series-nav.component';
import type { SeriesNavProps } from '../series-nav.types';

const makeMeta = () => ({
	slug: 'test-series',
	title: 'Test Series Title',
	description: 'A test series.',
});

const makePost = (slug: string, order: number) => ({
	slug,
	title: `Part ${order} Title`,
	description: `Part ${order} description`,
	tags: ['test'],
	date: '2024-01-01',
	content: '',
	series: 'test-series',
	seriesOrder: order,
	draft: false,
	metadata: { readingTime: 5, wordCount: 1000 },
});

const defaultProps: SeriesNavProps = {
	meta: makeMeta(),
	posts: [makePost('part-1', 1), makePost('part-2', 2), makePost('part-3', 3)] as never[],
	currentSlug: 'part-2',
};

describe('SeriesNav', () => {
	it('renders the series title', () => {
		render(<SeriesNav {...defaultProps} />);

		expect(screen.getByText('Test Series Title')).toBeInTheDocument();
	});

	it('renders all parts in the list', () => {
		render(<SeriesNav {...defaultProps} />);

		expect(screen.getByText('Part 1: Part 1 Title')).toBeInTheDocument();
		expect(screen.getByText('Part 2: Part 2 Title')).toBeInTheDocument();
		expect(screen.getByText('Part 3: Part 3 Title')).toBeInTheDocument();
	});

	it('renders the current part as a span, not a link', () => {
		render(<SeriesNav {...defaultProps} />);

		const currentPart = screen.getByText('Part 2: Part 2 Title');

		expect(currentPart.tagName).toBe('SPAN');
	});

	it('renders other parts as links', () => {
		render(<SeriesNav {...defaultProps} />);

		const part1 = screen.getByText('Part 1: Part 1 Title');
		const part3 = screen.getByText('Part 3: Part 3 Title');

		expect(part1.tagName).toBe('A');
		expect(part1).toHaveAttribute('href', '/blog/part-1');
		expect(part3.tagName).toBe('A');
		expect(part3).toHaveAttribute('href', '/blog/part-3');
	});

	it('renders prev and next arrows', () => {
		render(<SeriesNav {...defaultProps} />);

		const prevArrow = screen.getByText(/← Part 1/);
		const nextArrow = screen.getByText(/Part 3.*→/);

		expect(prevArrow).toBeInTheDocument();
		expect(nextArrow).toBeInTheDocument();
	});

	it('does not render prev arrow on the first part', () => {
		render(<SeriesNav {...defaultProps} currentSlug="part-1" />);

		const arrows = screen.getAllByRole('link');
		const arrowHrefs = arrows.map(link => link.getAttribute('href'));

		expect(arrowHrefs).not.toContain('/blog/part-0');
	});

	it('does not render next arrow on the last part', () => {
		render(<SeriesNav {...defaultProps} currentSlug="part-3" />);

		const nextArrow = screen.queryByText(/Part 4/);

		expect(nextArrow).not.toBeInTheDocument();
	});

	it('has a navigation landmark with accessible label', () => {
		render(<SeriesNav {...defaultProps} />);

		expect(screen.getByRole('navigation', { name: 'Series navigation' })).toBeInTheDocument();
	});

	it('marks the current part list item with data-current', () => {
		render(<SeriesNav {...defaultProps} />);

		const currentItem = screen.getByText('Part 2: Part 2 Title').closest('li');

		expect(currentItem).toHaveAttribute('data-current');
	});
});
