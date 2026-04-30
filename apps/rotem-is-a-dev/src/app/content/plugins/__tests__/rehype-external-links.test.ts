import { rehypeExternalLinks } from '../rehype-external-links';

type HastNode = {
	type: string;
	tagName?: string;
	properties?: Record<string, unknown>;
	children?: HastNode[];
};

function makeTree(children: HastNode[]): HastNode {
	return { type: 'root', children };
}

function makeLink(href: string, text: string): HastNode {
	return {
		type: 'element',
		tagName: 'a',
		properties: { href },
		children: [{ type: 'text', children: [], properties: { value: text } }],
	};
}

function makeParagraph(children: HastNode[]): HastNode {
	return { type: 'element', tagName: 'p', properties: {}, children };
}

describe('rehypeExternalLinks', () => {
	const transform = rehypeExternalLinks();

	it('adds target, rel, and icon to external links', () => {
		const link = makeLink('https://github.com/facebook/react', 'React');
		const tree = makeTree([makeParagraph([link])]);

		transform(tree);

		expect(link.properties!['target']).toBe('_blank');
		expect(link.properties!['rel']).toBe('noopener noreferrer');
		expect(link.children).toHaveLength(2);

		const icon = link.children![1];
		expect(icon.tagName).toBe('span');
		expect(icon.properties!['className']).toEqual(['external-link-icon']);
	});

	it('does not modify internal links', () => {
		const link = makeLink('/blog/some-post', 'Some Post');
		const tree = makeTree([makeParagraph([link])]);

		transform(tree);

		expect(link.properties!['target']).toBeUndefined();
		expect(link.properties!['rel']).toBeUndefined();
		expect(link.children).toHaveLength(1);
	});

	it('does not modify anchor links', () => {
		const link = makeLink('#section', 'Section');
		const tree = makeTree([makeParagraph([link])]);

		transform(tree);

		expect(link.properties!['target']).toBeUndefined();
		expect(link.children).toHaveLength(1);
	});

	it('handles links nested inside other elements', () => {
		const link = makeLink('https://example.com', 'Example');
		const tree = makeTree([
			makeParagraph([
				{ type: 'element', tagName: 'strong', properties: {}, children: [link] },
			]),
		]);

		transform(tree);

		expect(link.properties!['target']).toBe('_blank');
		expect(link.children).toHaveLength(2);
	});

	it('handles multiple external links in the same tree', () => {
		const linkA = makeLink('https://a.com', 'A');
		const linkB = makeLink('https://b.com', 'B');
		const tree = makeTree([makeParagraph([linkA, linkB])]);

		transform(tree);

		expect(linkA.children).toHaveLength(2);
		expect(linkB.children).toHaveLength(2);
	});

	it('does not share icon instances between links', () => {
		const linkA = makeLink('https://a.com', 'A');
		const linkB = makeLink('https://b.com', 'B');
		const tree = makeTree([makeParagraph([linkA, linkB])]);

		transform(tree);

		const iconA = linkA.children![1];
		const iconB = linkB.children![1];
		expect(iconA).not.toBe(iconB);
		expect(iconA.properties).not.toBe(iconB.properties);
	});

	it('skips non-element nodes', () => {
		const tree = makeTree([
			{ type: 'text', properties: { value: 'plain text' } },
			makeParagraph([makeLink('https://example.com', 'Example')]),
		]);

		transform(tree);

		const link = (tree.children![1] as HastNode).children![0];
		expect(link.properties!['target']).toBe('_blank');
	});

	it('skips links without properties', () => {
		const link: HastNode = {
			type: 'element',
			tagName: 'a',
			children: [{ type: 'text' }],
		};
		const tree = makeTree([makeParagraph([link])]);

		transform(tree);

		expect(link.children).toHaveLength(1);
	});

	it('handles http links the same as https', () => {
		const link = makeLink('http://example.com', 'Example');
		const tree = makeTree([makeParagraph([link])]);

		transform(tree);

		expect(link.properties!['target']).toBe('_blank');
		expect(link.children).toHaveLength(2);
	});

	it('appends an svg inside the icon span', () => {
		const link = makeLink('https://example.com', 'Example');
		const tree = makeTree([makeParagraph([link])]);

		transform(tree);

		const icon = link.children![1];
		expect(icon.children).toHaveLength(1);
		expect(icon.children![0].tagName).toBe('svg');
		expect(icon.children![0].children![0].tagName).toBe('path');
	});
});
