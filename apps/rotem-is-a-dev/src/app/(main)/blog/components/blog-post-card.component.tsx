import Link from 'next/link';
import { TagsList } from '@/app/components/tags-list';
import { formatDate } from '@/app/utils/format-date.util';
import styles from '../blog-page.module.scss';
import type { BlogPostCardProps } from './blog-post-card.types';

export const BlogPostCard = ({ post }: BlogPostCardProps) => {
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
				<TagsList tags={post.tags} draft={post.draft} />
			</Link>
		</li>
	);
};
