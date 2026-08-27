import { render } from '@testing-library/react';
import { BlogPostSchema } from '../blog-post-schema.component';
import type { Post } from '@/.velite';

const mockPost: Post = {
	slug: 'my-blog-post',
	title: 'My Blog Post',
	description: 'A great blog post.',
	tags: ['react', 'typescript'],
	date: '2026-03-01T00:00:00.000Z',
	draft: false,
	content: '<p>Content here</p>',
	metadata: { readingTime: 7, wordCount: 1400 },
};

const parseSchemas = (container: HTMLElement) =>
	Array.from(
		container.querySelectorAll('script[type="application/ld+json"]'),
	).map(node => JSON.parse(node.innerHTML));

const renderSchemas = (post: Post = mockPost) =>
	parseSchemas(render(<BlogPostSchema post={post} />).container);

describe('BlogPostSchema', () => {
	it('renders both JSON-LD blocks', () => {
		expect(renderSchemas()).toHaveLength(2);
	});

	it('emits valid JSON', () => {
		expect(() => renderSchemas()).not.toThrow();
	});

	it('marks the post as a BlogPosting', () => {
		const [posting] = renderSchemas();
		expect(posting['@type']).toBe('BlogPosting');
	});

	it('uses the post title as the headline', () => {
		const [posting] = renderSchemas();
		expect(posting.headline).toBe('My Blog Post');
	});

	it('uses the live domain for the canonical url', () => {
		const [posting] = renderSchemas();
		expect(posting.url).toBe('https://rotemhorovitz.com/blog/my-blog-post');
	});

	it('passes the ISO date straight through', () => {
		const [posting] = renderSchemas();
		expect(posting.datePublished).toBe('2026-03-01T00:00:00.000Z');
	});

	it('names the author', () => {
		const [posting] = renderSchemas();
		expect(posting.author.name).toBe('Rotem Horovitz');
	});

	it('joins tags into keywords', () => {
		const [posting] = renderSchemas();
		expect(posting.keywords).toBe('react, typescript');
	});

	it('omits keywords when there are no tags', () => {
		const [posting] = renderSchemas({ ...mockPost, tags: [] });
		expect(posting).not.toHaveProperty('keywords');
	});

	it('includes the word count', () => {
		const [posting] = renderSchemas();
		expect(posting.wordCount).toBe(1400);
	});

	it('omits image, since posts carry no hero image', () => {
		const [posting] = renderSchemas();
		expect(posting).not.toHaveProperty('image');
	});

	it('omits isPartOf for a standalone post', () => {
		const [posting] = renderSchemas();
		expect(posting).not.toHaveProperty('isPartOf');
	});

	it('adds isPartOf for a post in a known series', () => {
		const [posting] = renderSchemas({
			...mockPost,
			series: 'agentic-ai-development',
			seriesOrder: 1,
		} as Post);
		expect(posting.isPartOf.name).toBe(
			'Agentic AI Development: From Zero to Hero',
		);
	});

	it('ignores an unknown series rather than emitting a broken node', () => {
		const [posting] = renderSchemas({
			...mockPost,
			series: 'not-a-real-series',
		} as Post);
		expect(posting).not.toHaveProperty('isPartOf');
	});

	it('renders a three-level breadcrumb trail', () => {
		const [, breadcrumbs] = renderSchemas();
		expect(breadcrumbs.itemListElement).toHaveLength(3);
	});

	it('ends the breadcrumb trail on the post itself', () => {
		const [, breadcrumbs] = renderSchemas();
		expect(breadcrumbs.itemListElement[2]).toMatchObject({
			position: 3,
			name: 'My Blog Post',
			item: 'https://rotemhorovitz.com/blog/my-blog-post',
		});
	});
});
