import type { GameOverlayProps } from './game-overlay.types';
import styles from '../../rge-snake-game.module.scss';

export const GameOverlay = ({ phase, score, onStartAction, onRestartAction, onSkipAction }: GameOverlayProps) => {
	if (phase === 'playing') return null;

	const renderIdleOverlay = () => (
		<div className={styles.overlay} data-testid="overlay-idle">
			<div className={styles.overlayTitle}>SNAKE</div>
			<button className={styles.overlayButton} onClick={onStartAction} type="button">
				START GAME
			</button>
			{onSkipAction && (
				<button className={styles.overlaySkip} onClick={onSkipAction} type="button" data-testid="overlay-skip">
					skip
				</button>
			)}
		</div>
	);

	const renderLostOverlay = () => (
		<div className={styles.overlay} data-testid="overlay-lost">
			<div className={styles.overlayTitle}>GAME OVER</div>
			<div className={styles.overlayScore}>SCORE: {score}</div>
			<button className={styles.overlayButton} onClick={onRestartAction} type="button">
				TRY AGAIN
			</button>
		</div>
	);

	const renderWonOverlay = () => (
		<div className={styles.overlay} data-testid="overlay-won">
			<div className={styles.overlayTitle}>YOU WIN!</div>
			<div className={styles.overlayScore}>SCORE: {score}</div>
			<button className={styles.overlayButton} onClick={onRestartAction} type="button">
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
