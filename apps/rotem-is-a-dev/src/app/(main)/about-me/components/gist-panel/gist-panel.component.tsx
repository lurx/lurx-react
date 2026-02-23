'use client';

import chunkRaw from '@/snippets/chunk.snippet.ts?raw';
import debounceRaw from '@/snippets/debounce.snippet.ts?raw';
import { Gist } from './components/gist';
import styles from './gist-panel.module.scss';

const GISTS = [
	{
		title: 'debounce',
		username: 'lurx',
		createdAt: 'Created 5 months ago',
		detailsCount: 1,
		starsCount: 3,
		code: debounceRaw,
	},
	{
		title: 'chunk',
		username: 'lurx',
		createdAt: 'Created 9 months ago',
		detailsCount: 0,
		starsCount: 0,
		code: chunkRaw,
	},
];

export const GistPanel = () => {
	return (
		<div className={styles.panel}>
			<p className={styles.panelTitle}>{'// Code snippet showcase:'}</p>

			<div className={styles.snippets}>
				{GISTS.map(gist => (
					<Gist key={gist.title} {...gist} />
				))}
			</div>
		</div>
	);
};
