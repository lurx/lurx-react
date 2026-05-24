import styles from '../snippets-page.module.scss';
import type { SnippetTagProps } from '../snippets-page.types';

export const SnippetTag = ({ tag, draft }: SnippetTagProps) => (
	<span className={styles.tag} data-draft={draft || undefined}>
		{tag}
	</span>
);
