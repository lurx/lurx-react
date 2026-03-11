import type { GameOverlayProps } from './game-overlay.types';
import styles from '../../rge-snake-game.module.scss';

export const GameOverlay = ({ phase, score, onStart, onRestart, onSkip }: GameOverlayProps) => {
	if (phase === 'playing') return null;

	const renderIdleOverlay = () => (
		<div className={styles.overlay} data-testid="overlay-idle">
			<div className={styles.overlayTitle}>SNAKE</div>
			<button className={styles.overlayButton} onClick={onStart} type="button">
				START GAME
			</button>
			{onSkip && (
				<button className={styles.overlaySkip} onClick={onSkip} type="button" data-testid="overlay-skip">
					skip
				</button>
			)}
		</div>
	);

	const renderLostOverlay = () => (
		<div className={styles.overlay} data-testid="overlay-lost">
			<div className={styles.overlayTitle}>GAME OVER</div>
			<div className={styles.overlayScore}>SCORE: {score}</div>
			<button className={styles.overlayButton} onClick={onRestart} type="button">
				TRY AGAIN
			</button>
		</div>
	);

	const renderWonOverlay = () => (
		<div className={styles.overlay} data-testid="overlay-won">
			<div className={styles.overlayTitle}>YOU WIN!</div>
			<div className={styles.overlayScore}>SCORE: {score}</div>
			<button className={styles.overlayButton} onClick={onRestart} type="button">
				PLAY AGAIN
			</button>
		</div>
	);

	const overlayMap = {
		idle: renderIdleOverlay,
		lost: renderLostOverlay,
		won: renderWonOverlay,
		playing: () => null,
	};

	return overlayMap[phase]();
};
