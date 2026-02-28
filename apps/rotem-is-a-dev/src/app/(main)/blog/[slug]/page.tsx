import { posts } from '#velite';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogTagsList } from '../components';
import styles from './blog-post.module.scss';
import { BackToBlogLink, BlogPostHeader } from './components';

type BlogPostPageProps = {
	params: Promise<{ slug: string }>;
}

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

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	if (!post) notFound();

	return (
		<article className={styles.page}>
      <BackToBlogLink />
      <BlogPostHeader post={post} />
			<div
				className={styles.content}
				dangerouslySetInnerHTML={{ __html: post.content }}
			/>
		</article>
	);
}
