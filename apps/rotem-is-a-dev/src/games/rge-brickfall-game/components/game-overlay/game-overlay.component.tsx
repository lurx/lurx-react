import type { GameOverlayProps } from './game-overlay.types';
import styles from '../../rge-brickfall-game.module.scss';

export const GameOverlay = ({ phase, score, level, linesCleared, onStart, onRestart }: GameOverlayProps) => {
	if (phase === 'playing') return null;

	const renderIdleOverlay = () => (
		<div className={styles.overlay} data-testid="overlay-idle">
			<div className={styles.overlayTitle}>BRICKFALL</div>
			<button className={styles.overlayButton} onClick={onStart} type="button">
				START GAME
			</button>
		</div>
	);

	const renderLostOverlay = () => (
		<div className={styles.overlay} data-testid="overlay-lost">
			<div className={styles.overlayTitle}>GAME OVER</div>
			<div className={styles.overlayScore}>SCORE: {score}</div>
			<div className={styles.overlayScore}>LEVEL: {level}</div>
			<div className={styles.overlayScore}>LINES: {linesCleared}</div>
			<button className={styles.overlayButton} onClick={onRestart} type="button">
				TRY AGAIN
			</button>
		</div>
	);

	const overlayMap = {
		idle: renderIdleOverlay,
		lost: renderLostOverlay,
		playing: () => null,
	};

	return overlayMap[phase]();
};
