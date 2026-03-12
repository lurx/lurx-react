import type { Game } from '../../data/games.types';

export type GamesGridProps = {
	games: Game[];
	onPlay: (game: Game) => void;
};
