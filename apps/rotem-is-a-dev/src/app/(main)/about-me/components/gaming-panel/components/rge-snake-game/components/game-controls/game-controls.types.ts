import type { Direction } from '../../rge-snake-game.types';

export type GameControlsProps = {
	score: number;
	onDirectionPress: (direction: Direction) => void;
	activeDirection: Direction | null;
};
