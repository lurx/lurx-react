import type { Direction, KeyScheme } from '../../../games.types';

export type GameControlsProps = {
	score: number;
	onDirectionPress: (direction: Direction) => void;
	activeDirection: Direction | null;
	keyScheme: KeyScheme;
	isPlaying: boolean;
	onToggleKeyScheme: () => void;
};
