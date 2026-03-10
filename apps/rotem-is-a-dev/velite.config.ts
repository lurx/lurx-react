import rehypeShiki from '@shikijs/rehype';
import { defineCollection, defineConfig, s } from 'velite';

const posts = defineCollection({
	name: 'Post',
	pattern: 'posts/**/*.md',
	schema: s.object({
		title: s.string(),
		slug: s.slug('posts'),
		date: s.isodate(),
		description: s.string(),
		tags: s.array(s.string()),
		draft: s.boolean().default(false),
		content: s.markdown(),
		metadata: s.metadata(),
	}),
});

const pages = defineCollection({
	name: 'Page',
	pattern: 'pages/**/*.md',
	schema: s.object({
		title: s.string(),
		slug: s.slug('pages'),
		lastUpdated: s.string(),
		description: s.string(),
		content: s.markdown(),
	}),
});

export default defineConfig({
	root: 'src/app/content',
	output: {
		data: '.velite',
		assets: 'public/static',
		base: '/static/',
		clean: true,
	},
	collections: { posts, pages },
	markdown: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		rehypePlugins: [[rehypeShiki as any, { theme: 'night-owl' }]],
	},
});
