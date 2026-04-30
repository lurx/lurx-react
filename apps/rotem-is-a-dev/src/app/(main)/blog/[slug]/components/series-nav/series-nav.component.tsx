import Link from 'next/link';
import type { SeriesNavProps } from './series-nav.types';
import styles from './series-nav.module.scss';

export const SeriesNav = ({ meta, posts, currentSlug }: SeriesNavProps) => {
	const currentIndex = posts.findIndex(post => post.slug === currentSlug);
	const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
	const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

	return (
		<nav className={styles.nav} aria-label="Series navigation">
			<h3 className={styles.seriesTitle}>{meta.title}</h3>

			<ol className={styles.parts}>
				{posts.map((post, index) => {
					const isCurrent = post.slug === currentSlug;

					return (
						<li key={post.slug} className={styles.part} data-current={isCurrent || undefined}>
							{isCurrent
								? <span className={styles.partLink}>Part {index + 1}: {post.title}</span>
								: <Link href={`/blog/${post.slug}`} className={styles.partLink}>{`Part ${index + 1}: ${post.title}`}</Link>
							}
						</li>
					);
				})}
			</ol>

			<div className={styles.arrows}>
				{prevPost
					? <Link href={`/blog/${prevPost.slug}`} className={styles.arrow}>
							&larr; Part {currentIndex}: {prevPost.title}
						</Link>
					: <span />
				}
				{nextPost && (
					<Link href={`/blog/${nextPost.slug}`} className={styles.arrow} data-next>
						Part {currentIndex + 2}: {nextPost.title} &rarr;
					</Link>
				)}
			</div>
		</nav>
	);
};
