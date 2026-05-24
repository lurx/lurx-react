import Link from 'next/link';
import { formatDate } from '../snippets-page.helpers';
import styles from '../snippets-page.module.scss';
import type { SnippetCardProps } from './snippet-card.types';
import { SnippetTagsList } from './snippet-tags-list.component';

export const SnippetCard = ({ snippet }: SnippetCardProps) => (
	<li className={styles.card}>
		<Link
			href={`/snippets/${snippet.slug}`}
			className={styles.cardLink}
		>
			<h2 className={styles.cardTitle}>{snippet.title}</h2>
			<div className={styles.cardMeta}>
				<time dateTime={snippet.date}>{formatDate(snippet.date)}</time>
			</div>
			<p className={styles.cardDescription}>{snippet.description}</p>
			<SnippetTagsList tags={snippet.tags} draft={snippet.draft} />
		</Link>
	</li>
);
