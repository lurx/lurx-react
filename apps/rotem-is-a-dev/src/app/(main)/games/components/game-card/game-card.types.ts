import type { Game } from '../../data/games.types';

export type GameCardProps = {
	game: Game;
	onPlay: (game: Game) => void;
};
