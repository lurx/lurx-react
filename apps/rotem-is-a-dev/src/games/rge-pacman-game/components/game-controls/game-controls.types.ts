import type { Direction, KeyScheme } from '../../../games.types';

export type GameControlsProps = {
	score: number;
	lives: number;
	activeAction: Direction | null;
	keyScheme: KeyScheme;
	isPlaying: boolean;
	onDirectionPressAction: (direction: Direction) => void;
	onToggleKeySchemeAction: () => void;
};
