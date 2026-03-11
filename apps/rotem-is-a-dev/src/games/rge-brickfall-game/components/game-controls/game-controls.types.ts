import type { BrickfallAction, KeyScheme, TetrominoType } from '../../rge-brickfall-game.types';

export type GameControlsProps = {
	score: number;
	level: number;
	linesCleared: number;
	nextPieceType: TetrominoType;
	activeAction: BrickfallAction | null;
	keyScheme: KeyScheme;
	isPlaying: boolean;
	onToggleKeyScheme: () => void;
};
