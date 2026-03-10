import type { GameControlsProps } from './game-controls.types';
import type { Direction, KeyScheme } from '../../rge-snake-game.types';
import styles from '../../rge-snake-game.module.scss';

const KEY_LABELS: Record<KeyScheme, Record<Direction, string>> = {
	arrows: { UP: '\u25B2', LEFT: '\u25C0', RIGHT: '\u25B6', DOWN: '\u25BC' },
	wasd: { UP: 'W', LEFT: 'A', RIGHT: 'D', DOWN: 'S' },
};

const BUTTON_ORDER: Direction[] = ['UP', 'LEFT', 'RIGHT', 'DOWN'];

export const GameControls = ({
	score,
	onDirectionPress,
	activeDirection,
	keyScheme,
	onToggleKeyScheme,
}: GameControlsProps) => {
	const labels = KEY_LABELS[keyScheme];

	return (
		<div className={styles.controls} data-testid="game-controls">
			<div className={styles.score} data-testid="score">
				SCORE: {score}
			</div>
			<div className={styles.arrowGrid}>
				{BUTTON_ORDER.map((direction) => (
					<button
						key={direction}
						data-testid={`arrow-${direction.toLowerCase()}`}
						className={`${styles.arrowButton} ${activeDirection === direction ? styles.arrowButtonActive : ''}`}
						onClick={() => onDirectionPress(direction)}
						type="button"
						aria-label={`Move ${direction.toLowerCase()}`}
					>
						{labels[direction]}
					</button>
				))}
			</div>
			<button
				className={styles.schemeToggle}
				onClick={onToggleKeyScheme}
				type="button"
				data-testid="key-scheme-toggle"
			>
				{keyScheme === 'arrows' ? 'use WASD' : 'use arrows'}
			</button>
		</div>
	);
};
