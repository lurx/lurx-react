import { GameCard } from '../game-card';
import styles from './games-grid.module.scss';
import type { GamesGridProps } from './games-grid.types';

export const GamesGrid = ({ games, onPlay }: GamesGridProps) => (
	<div className={styles.container}>
		<div className={styles.grid}>
			{games.map(game => (
				<GameCard key={game.id} game={game} onPlay={onPlay} />
			))}
		</div>
	</div>
);
