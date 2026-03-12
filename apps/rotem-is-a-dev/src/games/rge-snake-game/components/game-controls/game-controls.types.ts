import type { Direction, KeyScheme } from '../../rge-snake-game.types';

export type GameControlsProps = {
	score: number;
	onDirectionPress: (direction: Direction) => void;
	activeDirection: Direction | null;
	keyScheme: KeyScheme;
	isPlaying: boolean;
	onToggleKeyScheme: () => void;
};
