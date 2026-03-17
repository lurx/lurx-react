import type { KeyScheme } from '../../../games.types';
import type { BrickfallAction, TetrominoType } from '../../rge-brickfall-game.types';

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
