import type { Direction, KeyScheme } from '../../../games.types';

export type GameControlsProps = {
	score: number;
	onDirectionPressAction: (direction: Direction) => void;
	activeDirection: Direction | null;
	keyScheme: KeyScheme;
	isPlaying: boolean;
	onToggleKeySchemeAction: () => void;
};
