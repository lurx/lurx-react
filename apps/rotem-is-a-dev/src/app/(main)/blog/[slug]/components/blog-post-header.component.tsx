import { formatDate } from '../../blog-page.helpers';
import type { BlogPostHeaderProps } from '../../blog-page.types';
import { BlogTagsList } from '../../components';
import styles from '../blog-post.module.scss';

export const BlogPostHeader = ({ post }: BlogPostHeaderProps) => {
	const {
		date,
		metadata: { readingTime },
		tags,
	} = post;
	return (
		<header className={styles.header}>
			<h1 className={styles.title}>{post.title}</h1>
			<div className={styles.meta}>
				<time dateTime={date}>{formatDate(date)}</time>
        {' | '}
				<span className={styles.readingTime}>{readingTime} min read</span>
			</div>
			<BlogTagsList tags={tags} />
		</header>
	);
};
