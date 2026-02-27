import type { BlogTagProps } from '../../blog-page.types';
import styles from '../../blog-page.module.scss';

export const BlogTag = ({ tag }: BlogTagProps) => (
	<span className={styles.tag}>{tag}</span>
);
