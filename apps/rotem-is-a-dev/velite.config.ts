import rehypeShiki from '@shikijs/rehype';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import rehypeMermaid from 'rehype-mermaid';
import {
  defineCollection,
  defineConfig,
  s,
  type MarkdownOptions,
  type MdxOptions,
} from 'velite';
import { mermaidConfig } from './src/app/content/plugins/mermaid.config';
import { rehypeExternalLinks } from './src/app/content/plugins/rehype-external-links';
import { rehypeMermaidBrFix } from './src/app/content/plugins/rehype-mermaid-br-fix';

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
		component: s.string().optional(),
		series: s.string().optional(),
		seriesOrder: s.number().optional(),
		content: s.markdown(),
		metadata: s.metadata(),
	}),
});

const mdxPosts = defineCollection({
	name: 'MdxPost',
	pattern: 'posts/**/*.mdx',
	schema: s.object({
		title: s.string(),
		slug: s.slug('posts'),
		date: s.isodate(),
		description: s.string(),
		tags: s.array(s.string()),
		draft: s.boolean().default(false),
		component: s.string().optional(),
		series: s.string().optional(),
		seriesOrder: s.number().optional(),
		content: s.markdown(),
		code: s.mdx(),
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

function createContentPlugins(): MarkdownOptions & MdxOptions {
	return {
		rehypePlugins: [
			rehypeExternalLinks,
			[rehypeMermaid, mermaidConfig],
			rehypeMermaidBrFix,
			[rehypeShiki, { theme: 'night-owl' }],
		],
	};
}

export default defineConfig({
	root: 'src/app/content',
	output: {
		data: '.velite',
		assets: 'public/static',
		base: '/static/',
		clean: true,
	},
	collections: { posts, mdxPosts, pages },
	complete: (_data, context) => {
		const trigger = resolve(
			dirname(context.config.configPath),
			'src/lib/mdx/velite-hmr-trigger.ts',
		);
		writeFileSync(
			trigger,
			`// Auto-touched by Velite on each rebuild to trigger Next.js HMR\nconst veliteHmrTrigger = ${Date.now()};\n\nexport default veliteHmrTrigger;\n`,
		);
	},
	markdown: createContentPlugins(),
	mdx: createContentPlugins(),
});
