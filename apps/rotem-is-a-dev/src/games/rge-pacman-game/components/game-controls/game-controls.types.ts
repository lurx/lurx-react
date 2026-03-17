import type { Direction, KeyScheme } from '../../rge-pacman-game.types';

export type GameControlsProps = {
	score: number;
	lives: number;
	activeAction: Direction | null;
	keyScheme: KeyScheme;
	isPlaying: boolean;
	onToggleKeyScheme: () => void;
};
