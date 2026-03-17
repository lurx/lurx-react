import type { BrickfallGamePhase } from '../../rge-brickfall-game.types';

export type GameOverlayProps = {
	phase: BrickfallGamePhase;
	score: number;
	level: number;
	linesCleared: number;
	onStart: () => void;
	onRestart: () => void;
};
