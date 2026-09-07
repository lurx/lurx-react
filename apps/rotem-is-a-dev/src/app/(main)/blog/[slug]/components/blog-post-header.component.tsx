import { TagsList } from '@/app/components/tags-list';
import { formatDate } from '@/app/utils/format-date.util';
import type { BlogPostHeaderProps } from '../../blog-page.types';
import styles from '../blog-post.module.scss';

export const BlogPostHeader = ({ post }: BlogPostHeaderProps) => {
	const {
		date,
		metadata: { readingTime },
		tags,
	} = post;
	return (
		<header className={styles.header}>
			<div className={styles.titleRow}>
				<h1 className={styles.title}>{post.title}</h1>
			</div>
			<div className={styles.meta}>
				<time dateTime={date}>{formatDate(date)}</time>
        {' | '}
				<span className={styles.readingTime}>{readingTime} min read</span>
			</div>
			<TagsList tags={tags} />
		</header>
	);
};
