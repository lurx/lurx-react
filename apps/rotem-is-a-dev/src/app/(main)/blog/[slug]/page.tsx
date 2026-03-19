import { Comments } from '@/app/components/comments';
import { posts } from '#velite';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { BlogPostPageProps } from './blog-post-page.types';
import styles from './blog-post.module.scss';
import { BackToBlogLink, BlogPostActions, BlogPostHeader } from './components';

function getPostBySlug(slug: string) {
	return posts.find(post => post.slug === slug && !post.draft);
}

export function generateStaticParams() {
	return posts
		.filter(post => !post.draft)
		.map(post => ({ slug: post.slug }));
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

	return (
		<article className={styles.page}>
      <BackToBlogLink />
      <BlogPostHeader post={post} actions={<BlogPostActions entityType="blog" entityId={slug} />} />
			<div
				className={styles.content}
				dangerouslySetInnerHTML={{ __html: post.content }}
			/>
			<Comments entityType="blog" entityId={slug} />
		</article>
	);
}
