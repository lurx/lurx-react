import styles from './tag.module.scss';
import type { TagProps } from './tag.types';

export const Tag = ({ tag, draft }: TagProps) => (
	<span className={styles.tag} data-draft={draft || undefined}>
		{tag}
	</span>
);
