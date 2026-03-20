'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import type { Game } from '../../data/games.data';
import { GAMES } from '../../data/games.data';
import { GameDialog } from '../game-dialog';
import { GamesGrid } from '../games-grid';
import styles from './games-page.module.scss';

const findGameBySlug = (slug: string): Nullable<Game> =>
	GAMES.find(game => game.slug === `_${slug}`) ?? null;

export const GamesPage = () => {
	const [selectedGame, setSelectedGame] = useState<Nullable<Game>>(null);

	const searchParams = useSearchParams();
	const playGame = searchParams.get('play-game');

	useEffect(() => {
		if (playGame) {
			const game = findGameBySlug(playGame);
			if (game) setSelectedGame(game);
		}
	}, [playGame]);

	const handlePlay = useCallback((game: Game) => {
		setSelectedGame(game);
	}, []);

	const handleCloseDialog = useCallback(() => {
		setSelectedGame(null);
	}, []);

	return (
		<div className={styles.page}>
			<GamesGrid games={GAMES} onPlayAction={handlePlay} />
			<GameDialog game={selectedGame} onCloseAction={handleCloseDialog} />
		</div>
	);
};
