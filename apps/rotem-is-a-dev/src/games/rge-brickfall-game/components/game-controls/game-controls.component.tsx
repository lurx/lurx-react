import { ArrowKeyGrid } from '../../../components/arrow-key-grid';
import type { ArrowKeyGridItem } from '../../../components/arrow-key-grid';
import type { BrickfallAction, KeyScheme } from '../../rge-brickfall-game.types';
import { NextPiecePreview } from '../next-piece-preview';
import type { GameControlsProps } from './game-controls.types';
import styles from '../../rge-brickfall-game.module.scss';

const ARROW_LABELS: Record<BrickfallAction, string> = {
	ROTATE: '\u25B2', LEFT: '\u25C0', RIGHT: '\u25B6', SOFT_DROP: '\u25BC', HARD_DROP: '\u2587',
};

const WASD_LABELS: Record<BrickfallAction, string> = {
	ROTATE: 'W', LEFT: 'A', RIGHT: 'D', SOFT_DROP: 'S', HARD_DROP: '\u2587',
};

const LABEL_MAPS: Record<KeyScheme, Record<BrickfallAction, string>> = {
	arrows: ARROW_LABELS,
	wasd: WASD_LABELS,
};

const buildItems = (keyScheme: KeyScheme): ArrowKeyGridItem<BrickfallAction>[] => {
	const labels = LABEL_MAPS[keyScheme];
	return [
		{ value: 'ROTATE', label: labels.ROTATE, testId: 'action-rotate' },
		{ value: 'LEFT', label: labels.LEFT, testId: 'action-left' },
		{ value: 'RIGHT', label: labels.RIGHT, testId: 'action-right' },
		{ value: 'SOFT_DROP', label: labels.SOFT_DROP, testId: 'action-soft-drop' },
	];
};

const buildBottomAction = (keyScheme: KeyScheme): ArrowKeyGridItem<BrickfallAction> => {
	const labels = LABEL_MAPS[keyScheme];
	return { value: 'HARD_DROP', label: labels.HARD_DROP, testId: 'action-hard-drop' };
};

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
	const items = buildItems(keyScheme);
	const bottomAction = buildBottomAction(keyScheme);

	return (
		<div className={styles.controls} data-testid="game-controls">
			<div className={styles.stats}>
				<div className={styles.score} data-testid="score">SCORE: {score}</div>
				<div className={styles.statLine} data-testid="level">LEVEL: {level}</div>
				<div className={styles.statLine} data-testid="lines">LINES: {linesCleared}</div>
			</div>
			<NextPiecePreview type={nextPieceType} />
			<ArrowKeyGrid
				items={items}
				activeValue={activeAction}
				bottomAction={bottomAction}
			/>
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
