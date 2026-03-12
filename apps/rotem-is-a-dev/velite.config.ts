import rehypeShiki from '@shikijs/rehype';
import rehypeMermaid from 'rehype-mermaid';
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
		rehypePlugins: [
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			[rehypeMermaid as any, {
				strategy: 'img-svg',
				colorScheme: 'dark',
				mermaidConfig: {
					theme: 'base',
					themeVariables: {
						background: '#1d293d',
						primaryColor: '#1d293d',
						primaryTextColor: '#f8fafc',
						primaryBorderColor: '#314158',
						secondaryColor: '#0f172b',
						secondaryTextColor: '#f8fafc',
						secondaryBorderColor: '#314158',
						tertiaryColor: '#0f172b',
						tertiaryTextColor: '#f8fafc',
						tertiaryBorderColor: '#314158',
						lineColor: '#43d9ad',
						textColor: '#f8fafc',
						mainBkg: '#1d293d',
						nodeBorder: '#314158',
						clusterBkg: '#0f172b',
						clusterBorder: '#314158',
						titleColor: '#f8fafc',
						edgeLabelBackground: '#0f172b',
						nodeTextColor: '#f8fafc',
					},
				},
			}],
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			[rehypeShiki as any, { theme: 'night-owl' }],
		],
	},
});
