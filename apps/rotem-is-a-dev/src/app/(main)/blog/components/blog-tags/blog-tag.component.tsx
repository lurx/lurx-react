import styles from '../../blog-page.module.scss';
import type { BlogTagProps } from '../../blog-page.types';

export const BlogTag = ({ tag, draft }: BlogTagProps) => (
	<span className={styles.tag} data-draft={draft || undefined}>
		{tag}
	</span>
);
