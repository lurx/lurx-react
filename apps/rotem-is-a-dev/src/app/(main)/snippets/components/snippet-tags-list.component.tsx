import styles from '../snippets-page.module.scss';
import type { SnippetTagsListProps } from '../snippets-page.types';
import { SnippetTag } from './snippet-tag.component';

export const SnippetTagsList = ({ tags, draft }: SnippetTagsListProps) => (
	<div className={styles.tags}>
		{draft && <SnippetTag tag="draft" draft />}
		{tags.map(tag => (
			<SnippetTag key={tag} tag={tag} />
		))}
	</div>
);
