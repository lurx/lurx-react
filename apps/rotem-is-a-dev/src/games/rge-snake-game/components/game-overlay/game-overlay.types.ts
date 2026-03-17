import type { SnakeGamePhase } from '../../rge-snake-game.types';

export type GameOverlayProps = {
	phase: SnakeGamePhase;
	score: number;
	onStart: () => void;
	onRestart: () => void;
	onSkip?: () => void;
};
