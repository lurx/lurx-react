import type { Game } from '../../data/games.types';

export type GameCardProps = {
	game: Game;
	onPlayAction: (game: Game) => void;
};
