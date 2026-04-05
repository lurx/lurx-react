import { useMemo } from 'react';
import { formatDate } from '../../blog-page.helpers';
import { BlogTagsList } from '../blog-tags';
import type { BlogSeriesCardProps } from './blog-series-card.types';
import styles from './blog-series-card.module.scss';
import { BlogSeriesMiniCard } from './components/blog-series-mini-card';

export const BlogSeriesCard = ({ meta, posts }: BlogSeriesCardProps) => {
	const sharedTags = useMemo(() => {
		if (posts.length === 0) return [];

		const firstPostTags = new Set(posts[0].tags);

		return [...firstPostTags]
			.filter(tag => posts.every(post => post.tags.includes(tag)))
			.sort((tagA, tagB) => tagA.localeCompare(tagB));
	}, [posts]);

	const isDraft = posts.some(post => post.draft);

	const latestDate = useMemo(() => {
		if (posts.length === 0) return null;

		return posts.reduce((latest, post) =>
			post.date > latest ? post.date : latest, posts[0].date);
	}, [posts]);

	return (
		<li className={styles.seriesCard}>
			<h2 className={styles.seriesTitle}>{meta.title}</h2>
			<div className={styles.seriesMeta}>
				{latestDate && <time dateTime={latestDate}>{formatDate(latestDate)}</time>}
				<span>{posts.length} parts</span>
			</div>
			<p className={styles.seriesDescription}>{meta.description}</p>
			<BlogTagsList
				tags={sharedTags}
				draft={isDraft}
			/>
			<ul className={styles.seriesGrid}>
				{posts.map((post, index) => (
					<BlogSeriesMiniCard
						key={post.slug}
						post={post}
						partNumber={index + 1}
						sharedTags={sharedTags}
					/>
				))}
			</ul>
		</li>
	);
};
