'use client';

import { useResponsive } from '@/hooks';
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
	const { isMobile } = useResponsive();

	if (isMobile) return null;

	return (
		<div className={styles.panel}>
			<p className={styles.panelTitle}>{'// Code snippet showcase:'}</p>

			<div className={styles.snippets}>
				{GISTS.map(gist => (
					<Gist
						key={gist.title}
						title={gist.title}
						username={gist.username}
						createdAt={gist.createdAt}
						detailsCount={gist.detailsCount}
						starsCount={gist.starsCount}
						code={gist.code}
					/>
				))}
			</div>
		</div>
	);
};
