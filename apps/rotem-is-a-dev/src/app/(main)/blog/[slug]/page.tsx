import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { posts } from '#velite';
import styles from './blog-post.module.scss';

interface BlogPostPageProps {
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
			<Link
				href="/blog"
				className={styles.backLink}
			>
				&larr; Back to blog
			</Link>
			<header className={styles.header}>
				<h1 className={styles.title}>{post.title}</h1>
				<div className={styles.meta}>
					<time dateTime={post.date}>
						{formatDate(post.date)}
					</time>
					<span>{post.metadata.readingTime} min read</span>
				</div>
				<div className={styles.tags}>
					{post.tags.map(tag => (
						<span
							key={tag}
							className={styles.tag}
						>
							{tag}
						</span>
					))}
				</div>
			</header>
			<div
				className={styles.content}
				dangerouslySetInnerHTML={{ __html: post.content }}
			/>
		</article>
	);
}
