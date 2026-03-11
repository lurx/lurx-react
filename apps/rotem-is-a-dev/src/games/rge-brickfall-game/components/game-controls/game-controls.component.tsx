import type { BrickfallAction, KeyScheme } from '../../rge-brickfall-game.types';
import { NextPiecePreview } from '../next-piece-preview';
import type { GameControlsProps } from './game-controls.types';
import styles from '../../rge-brickfall-game.module.scss';

const KEY_LABELS: Record<KeyScheme, Record<BrickfallAction, string>> = {
	arrows: { LEFT: '\u25C0', RIGHT: '\u25B6', ROTATE: '\u25B2', SOFT_DROP: '\u25BC', HARD_DROP: '\u2587' },
	wasd: { LEFT: 'A', RIGHT: 'D', ROTATE: 'W', SOFT_DROP: 'S', HARD_DROP: '\u2587' },
};

const BUTTON_ORDER: BrickfallAction[] = ['ROTATE', 'LEFT', 'RIGHT', 'SOFT_DROP', 'HARD_DROP'];

export const GameControls = ({
	score,
	level,
	linesCleared,
	nextPieceType,
	activeAction,
	keyScheme,
	isPlaying,
	onToggleKeyScheme,
}: GameControlsProps) => {
	const labels = KEY_LABELS[keyScheme];

	return (
		<div className={styles.controls} data-testid="game-controls">
			<div className={styles.stats}>
				<div className={styles.score} data-testid="score">SCORE: {score}</div>
				<div className={styles.statLine} data-testid="level">LEVEL: {level}</div>
				<div className={styles.statLine} data-testid="lines">LINES: {linesCleared}</div>
			</div>
			<NextPiecePreview type={nextPieceType} />
			<div className={styles.arrowGrid}>
				{BUTTON_ORDER.map((action) => (
					<button
						key={action}
						data-testid={`action-${action.toLowerCase().replace('_', '-')}`}
						className={`${styles.arrowButton} ${activeAction === action ? styles.arrowButtonActive : ''}`}
						type="button"
						aria-label={action.toLowerCase().replace('_', ' ')}
					>
						{labels[action]}
					</button>
				))}
			</div>
			{!isPlaying && (
				<button
					className={styles.schemeToggle}
					onClick={onToggleKeyScheme}
					type="button"
					data-testid="key-scheme-toggle"
				>
					{keyScheme === 'arrows' ? 'use WASD' : 'use arrows'}
				</button>
			)}
		</div>
	);
};
