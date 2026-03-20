import type { SnakeGamePhase } from '../../rge-snake-game.types';

export type GameOverlayProps = {
	phase: SnakeGamePhase;
	score: number;
	onStartAction: () => void;
	onRestartAction: () => void;
	onSkipAction?: () => void;
};
