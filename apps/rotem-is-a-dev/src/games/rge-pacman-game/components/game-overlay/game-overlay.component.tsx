import type { GameOverlayProps } from './game-overlay.types';
import styles from '../../rge-pacman-game.module.scss';

export const GameOverlay = ({ phase, score, lives, onStart, onRestart }: GameOverlayProps) => {
	if (phase === 'playing' || phase === 'dying') return null;

	const renderIdleOverlay = () => (
		<div className={styles.overlay} data-testid="overlay-idle">
			<div className={styles.overlayTitle}>PAC-MAN</div>
			<button className={styles.overlayButton} onClick={onStart} type="button">
				START GAME
			</button>
		</div>
	);

	const renderWonOverlay = () => (
		<div className={styles.overlay} data-testid="overlay-won">
			<div className={styles.overlayTitle}>YOU WIN</div>
			<div className={styles.overlayScore}>SCORE: {score}</div>
			<button className={styles.overlayButton} onClick={onRestart} type="button">
				PLAY AGAIN
			</button>
		</div>
	);

	const renderLostOverlay = () => (
		<div className={styles.overlay} data-testid="overlay-lost">
			<div className={styles.overlayTitle}>GAME OVER</div>
			<div className={styles.overlayScore}>SCORE: {score}</div>
			<div className={styles.overlayScore}>LIVES: {lives}</div>
			<button className={styles.overlayButton} onClick={onRestart} type="button">
				TRY AGAIN
			</button>
		</div>
	);

	const overlayMap = {
		idle: renderIdleOverlay,
		won: renderWonOverlay,
		lost: renderLostOverlay,
		playing: () => null,
	};

	return overlayMap[phase]();
};
