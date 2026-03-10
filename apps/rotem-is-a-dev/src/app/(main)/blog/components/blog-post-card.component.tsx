import Link from 'next/link';
import { formatDate } from '../blog-page.helpers';
import styles from '../blog-page.module.scss';
import { BlogPostCardFooter } from './blog-post-card-footer';
import type { BlogPostCardProps } from './blog-post-card.types';
import { BlogTagsList } from './blog-tags';

export const BlogPostCard = ({ post, onCommentClick }: BlogPostCardProps) => {
	const handleCommentClick = onCommentClick ? () => onCommentClick(post) : undefined;

	return (
		<li className={styles.card}>
			<Link
				href={`/blog/${post.slug}`}
				className={styles.cardLink}
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
				<BlogTagsList tags={post.tags} />
			</Link>
			{handleCommentClick && (
				<BlogPostCardFooter
					entityType="blog"
					entityId={post.slug}
					onCommentClick={handleCommentClick}
				/>
			)}
		</li>
	);
};
