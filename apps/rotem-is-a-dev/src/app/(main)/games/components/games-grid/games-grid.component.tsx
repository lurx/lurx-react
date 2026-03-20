import { GameCard } from '../game-card';
import styles from './games-grid.module.scss';
import type { GamesGridProps } from './games-grid.types';

export const GamesGrid = ({ games, onPlayAction }: GamesGridProps) => (
	<div className={styles.container}>
		<div className={styles.grid}>
			{games.map(game => (
				<GameCard key={game.id} game={game} onPlayAction={onPlayAction} />
			))}
		</div>
	</div>
);
