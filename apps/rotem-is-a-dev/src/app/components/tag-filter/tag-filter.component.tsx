import styles from './tag-filter.module.scss';
import type { TagFilterProps } from './tag-filter.types';

export const TagFilter = ({ tags, selected, onToggleAction }: TagFilterProps) => (
	<div className={styles.filter} role="group" aria-label="Filter by tags">
		<span className={styles.label}>_tags:</span>
		<div className={styles.tags}>
			{tags.map(tag => (
				<button
					key={tag}
					type="button"
					className={styles.tag}
					aria-pressed={selected.includes(tag)}
					onClick={() => onToggleAction(tag)}
				>
					{tag}
				</button>
			))}
		</div>
	</div>
);
