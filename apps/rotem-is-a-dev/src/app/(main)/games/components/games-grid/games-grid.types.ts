import type { Game } from '../../data/games.types';

export type GamesGridProps = {
	games: Game[];
	onPlayAction: (game: Game) => void;
};
