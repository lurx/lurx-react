import type { Post } from '#velite';
import Link from 'next/link';
import { formatDate } from '../blog-page.helpers';
import styles from '../blog-page.module.scss';
import { BlogTagsList } from './blog-tags';

type BlogPostCardProps = {
	post: Post;
}

export const BlogPostCard = ({ post }: BlogPostCardProps) => (
	<li>
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
			<BlogTagsList tags={post.tags} />
		</Link>
	</li>
);
