import { Tag } from '../tag';
import styles from './tags-list.module.scss';
import type { TagsListProps } from './tags-list.types';

export const TagsList = ({ tags, draft }: TagsListProps) => (
	<div className={styles.tags}>
		{draft && <Tag tag="draft" draft />}
		{tags.map(tag => (
			<Tag key={tag} tag={tag} />
		))}
	</div>
);
