import Link from 'next/link';
import { BlogTagsList } from '../../../blog-tags';
import type { BlogSeriesMiniCardProps } from './blog-series-mini-card.types';
import styles from './blog-series-mini-card.module.scss';

export const BlogSeriesMiniCard = ({ post, partNumber, sharedTags }: BlogSeriesMiniCardProps) => {
	const uniqueTags = post.tags.filter(tag => !sharedTags.includes(tag));

	return (
		<li className={styles.miniCard}>
			<Link href={`/blog/${post.slug}`} className={styles.miniCardLink}>
				<span className={styles.partBadge}>Part {partNumber}</span>
				<h3 className={styles.miniCardTitle}>{post.title}</h3>
				<div className={styles.miniCardFooter}>
					<span className={styles.miniCardMeta}>
						{post.metadata.readingTime} min read
					</span>
					{uniqueTags.length > 0 && <BlogTagsList tags={uniqueTags} />}
				</div>
			</Link>
		</li>
	);
};
