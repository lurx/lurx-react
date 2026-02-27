import type { Metadata } from 'next';
import Link from 'next/link';
import { posts } from '#velite';
import styles from './blog-page.module.scss';

export const metadata: Metadata = {
	title: 'Blog',
	description:
		'Read the latest articles and insights from Rotem Horovitz on frontend development, web technologies, and more.',
};

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

export default function BlogPage() {
	const publishedPosts = posts
		.filter(post => !post.draft)
		.sort(
			(postA, postB) =>
				new Date(postB.date).getTime() -
				new Date(postA.date).getTime(),
		);

	if (publishedPosts.length === 0) {
		return (
			<div className={styles.empty}>No posts yet. Stay tuned!</div>
		);
	}

	return (
		<div className={styles.page}>
			<header className={styles.header}>
				<h1 className={styles.title}>Blog</h1>
				<p className={styles.description}>
					Articles on frontend development, React patterns, and web
					technologies.
				</p>
			</header>
			<ul className={styles.list}>
				{publishedPosts.map(post => (
					<li key={post.slug}>
						<Link
							href={`/blog/${post.slug}`}
							className={styles.card}
						>
							<h2 className={styles.cardTitle}>
								{post.title}
							</h2>
							<div className={styles.cardMeta}>
								<time dateTime={post.date}>
									{formatDate(post.date)}
								</time>
								<span>
									{post.metadata.readingTime} min read
								</span>
							</div>
							<p className={styles.cardDescription}>
								{post.description}
							</p>
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
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
