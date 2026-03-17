import type { PacmanGamePhase } from '../../rge-pacman-game.types';

export type GameOverlayProps = {
	phase: PacmanGamePhase;
	score: number;
	lives: number;
	onStart: () => void;
	onRestart: () => void;
};
