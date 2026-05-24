import Link from 'next/link';
import { TagsList } from '@/app/components/tags-list';
import { formatDate } from '@/app/utils/format-date.util';
import styles from '../snippets-page.module.scss';
import type { SnippetCardProps } from './snippet-card.types';

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
			<TagsList tags={snippet.tags} draft={snippet.draft} />
		</Link>
	</li>
);
