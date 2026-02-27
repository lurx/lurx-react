import styles from '../../blog-page.module.scss';
import type { BlogTagsListProps } from '../../blog-page.types';
import { BlogTag } from './blog-tag.component';

export const BlogTagsList = ({ tags }: BlogTagsListProps) => (
	<div className={styles.tags}>
		{tags.map(tag => (
			<BlogTag
				key={tag}
				tag={tag}
			/>
		))}
	</div>
);
