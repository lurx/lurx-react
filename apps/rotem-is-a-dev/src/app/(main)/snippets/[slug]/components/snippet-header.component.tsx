import { SnippetTagsList } from '../../components';
import { formatDate } from '../../snippets-page.helpers';
import type { SnippetHeaderProps } from '../../snippets-page.types';
import styles from '../snippet.module.scss';

export const SnippetHeader = ({ snippet }: SnippetHeaderProps) => {
	const { date, tags, title, description } = snippet;

	return (
		<header className={styles.header}>
			<h1 className={styles.title}>{title}</h1>
			<p className={styles.description}>{description}</p>
			<div className={styles.meta}>
				<time dateTime={date}>{formatDate(date)}</time>
			</div>
			<SnippetTagsList tags={tags} />
		</header>
	);
};
