import type { GamePhase } from '../../rge-snake-game.types';

export type GameOverlayProps = {
	phase: GamePhase;
	score: number;
	onStart: () => void;
	onRestart: () => void;
	onSkip?: () => void;
};
