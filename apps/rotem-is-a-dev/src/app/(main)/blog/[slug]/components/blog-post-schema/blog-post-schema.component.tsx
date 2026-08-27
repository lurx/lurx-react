import { AUTHOR, SITE_NAME, SITE_URL } from '@/data/site.data';
import { SERIES_META } from '../../../data/blog-series.data';
import type { BlogPostSchemaProps } from './blog-post-schema.types';

/**
 * Emits BlogPosting and BreadcrumbList JSON-LD for a post.
 *
 * Everything comes from the Velite `post` object, so every existing and future
 * post is covered without touching frontmatter. Google lists no required
 * properties for Article; these are the recommended ones it can actually use.
 *
 * `image` is deliberately absent: posts carry no hero image, and pointing every
 * article at one unrelated site image is worse than omitting the property.
 */
export const BlogPostSchema = ({ post }: BlogPostSchemaProps) => {
	const url = `${SITE_URL}/blog/${post.slug}`;
	const series =
		post.series && post.series in SERIES_META
			? SERIES_META[post.series as keyof typeof SERIES_META]
			: undefined;

	const blogPosting = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.description,
		datePublished: post.date,
		dateModified: post.date,
		url,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		author: {
			'@type': 'Person',
			name: AUTHOR.name,
			url: AUTHOR.url,
			sameAs: [...AUTHOR.sameAs],
		},
		publisher: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
		inLanguage: 'en',
		...(post.tags.length > 0 && { keywords: post.tags.join(', ') }),
		...(post.metadata.wordCount > 0 && { wordCount: post.metadata.wordCount }),
		...(series && {
			isPartOf: {
				'@type': 'CreativeWorkSeries',
				name: series.title,
				url: `${SITE_URL}/blog`,
			},
		}),
	};

	const breadcrumbs = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
			{
				'@type': 'ListItem',
				position: 2,
				name: 'Blog',
				item: `${SITE_URL}/blog`,
			},
			{ '@type': 'ListItem', position: 3, name: post.title, item: url },
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
			/>
		</>
	);
};
