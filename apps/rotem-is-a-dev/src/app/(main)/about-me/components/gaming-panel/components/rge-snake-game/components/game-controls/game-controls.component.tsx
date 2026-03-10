import type { GameControlsProps } from './game-controls.types';
import type { Direction } from '../../rge-snake-game.types';
import styles from '../../rge-snake-game.module.scss';

const ARROW_BUTTONS: { direction: Direction; label: string }[] = [
	{ direction: 'UP', label: '\u25B2' },
	{ direction: 'LEFT', label: '\u25C0' },
	{ direction: 'RIGHT', label: '\u25B6' },
	{ direction: 'DOWN', label: '\u25BC' },
];

export const GameControls = ({
	score,
	onDirectionPress,
	activeDirection,
}: GameControlsProps) => (
	<div className={styles.controls} data-testid="game-controls">
		<div className={styles.score} data-testid="score">
			SCORE: {score}
		</div>
		<div className={styles.arrowGrid}>
			{ARROW_BUTTONS.map(({ direction, label }) => (
				<button
					key={direction}
					data-testid={`arrow-${direction.toLowerCase()}`}
					className={`${styles.arrowButton} ${activeDirection === direction ? styles.arrowButtonActive : ''}`}
					onClick={() => onDirectionPress(direction)}
					type="button"
					aria-label={`Move ${direction.toLowerCase()}`}
				>
					{label}
				</button>
			))}
		</div>
	</div>
);
