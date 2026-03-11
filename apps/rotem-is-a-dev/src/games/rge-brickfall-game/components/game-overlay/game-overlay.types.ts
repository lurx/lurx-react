import type { GamePhase } from '../../rge-brickfall-game.types';

export type GameOverlayProps = {
	phase: GamePhase;
	score: number;
	level: number;
	linesCleared: number;
	onStart: () => void;
	onRestart: () => void;
};
