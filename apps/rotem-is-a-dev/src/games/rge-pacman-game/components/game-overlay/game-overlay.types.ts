import type { GamePhase } from '../../rge-pacman-game.types';

export type GameOverlayProps = {
	phase: GamePhase;
	score: number;
	lives: number;
	onStart: () => void;
	onRestart: () => void;
};
