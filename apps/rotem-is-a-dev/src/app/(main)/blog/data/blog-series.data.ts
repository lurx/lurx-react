import type { SeriesMeta } from './blog-series.types';

export const SERIES_META = {
	'agentic-ai-development': {
		slug: 'agentic-ai-development',
		title: 'Agentic AI Development: From Zero to Hero',
		description: 'A six-part deep dive into AI coding agents — what they are, how to use them, and how teams are building with them.',
	},
	'react-under-the-hood': {
		slug: 'react-under-the-hood',
		title: 'React Under the Hood',
		description: 'An eight-part series on React internals — hooks, rendering, fibers, reconciliation, and the concurrent scheduler.',
	},
} satisfies Record<string, SeriesMeta>;
