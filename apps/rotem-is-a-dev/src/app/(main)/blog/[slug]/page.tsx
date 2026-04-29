import '@/lib/mdx/velite-hmr-trigger';
import { Comments } from '@/app/components/comments';
import { IS_PREVIEW_ENV } from '@/app/utils/is-preview-env.util';
import { posts, mdxPosts } from '#velite';
import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SERIES_META } from '../data/blog-series.data';
import type { AnyPost } from '../blog-page.types';
import type { BlogPostPageProps } from './blog-post-page.types';
import styles from './blog-post.module.scss';
import { BackToBlogLink, BlogPostActions, BlogPostHeader, SeriesNav } from './components';

type InteractivePostProps = {
	code?: string;
};

const interactivePostRegistry: Record<string, () => Promise<{ default: ComponentType<InteractivePostProps> }>> = {
	'pretext-benchmark': () => import('./interactive-posts/pretext-benchmark'),
};

function getPostBySlug(slug: string) {
	const mdPost = posts.find(post => post.slug === slug && (IS_PREVIEW_ENV || !post.draft));

	if (mdPost) return mdPost;

	const mdxPost = mdxPosts.find(post => post.slug === slug && (IS_PREVIEW_ENV || !post.draft));

	if (mdxPost) return mdxPost;

	return undefined;
}

function getSeriesContext(post: AnyPost) {
	const seriesSlug = post.series;

	if (!seriesSlug || !(seriesSlug in SERIES_META)) return null;

	const allPosts = [...posts, ...mdxPosts] as AnyPost[];
	const seriesPosts = allPosts
		.filter(candidate => candidate.series === seriesSlug && (IS_PREVIEW_ENV || !candidate.draft))
		.sort((postA, postB) => (postA.seriesOrder ?? 0) - (postB.seriesOrder ?? 0));

	return {
		meta: SERIES_META[seriesSlug as keyof typeof SERIES_META],
		posts: seriesPosts,
	};
}

function getMdxCode(slug: string): string | undefined {
	const mdxPost = mdxPosts.find(post => post.slug === slug && (IS_PREVIEW_ENV || !post.draft));

	return mdxPost?.code;
}

export function generateStaticParams() {
	const mdParams = posts
		.filter(post => IS_PREVIEW_ENV || !post.draft)
		.map(post => ({ slug: post.slug }));
	const mdxParams = mdxPosts
		.filter(post => IS_PREVIEW_ENV || !post.draft)
		.map(post => ({ slug: post.slug }));

	return [...mdParams, ...mdxParams];
}

export async function generateMetadata({
	params,
}: BlogPostPageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	if (!post) return {};

	return {
		title: post.title,
		description: post.description,
	};
}

export default async function BlogPostPage({ params }: Readonly<BlogPostPageProps>) {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	if (!post) notFound();

	const interactiveLoader = post.component ? interactivePostRegistry[post.component] : undefined;
	const InteractiveContent = interactiveLoader ? (await interactiveLoader()).default : undefined;
	const mdxCode = getMdxCode(slug);
	const seriesContext = getSeriesContext(post);

	return (
		<article className={styles.page}>
      <BackToBlogLink />
      <BlogPostHeader post={post} actions={<BlogPostActions entityType="blog" entityId={slug} />} />
			{InteractiveContent
				? <InteractiveContent code={mdxCode} />
				: <div
						className={styles.content}
						dangerouslySetInnerHTML={{ __html: post.content }}
					/>
			}
			{seriesContext && (
				<SeriesNav
					meta={seriesContext.meta}
					posts={seriesContext.posts}
					currentSlug={slug}
				/>
			)}
			<Comments entityType="blog" entityId={slug} />
		</article>
	);
}
