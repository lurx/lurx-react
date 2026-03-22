import type { ReactNode } from 'react';
import { FaIcon } from '@/app/components/fa-icon';
import { ArrowKeyGrid } from '../../../components/arrow-key-grid';
import type { ArrowKeyGridItem } from '../../../components/arrow-key-grid';
import type { KeyScheme } from '../../../games.types';
import type { BrickfallAction } from '../../rge-brickfall-game.types';
import { NextPiecePreview } from '../next-piece-preview';
import type { GameControlsProps } from './game-controls.types';
import styles from '../../rge-brickfall-game.module.scss';

const ARROW_LABELS: Record<BrickfallAction, ReactNode> = {
	ROTATE: <FaIcon iconName="caret-up" iconGroup="fas" size="lg" />,
	LEFT: <FaIcon iconName="caret-left" iconGroup="fas" size="lg" />,
	RIGHT: <FaIcon iconName="caret-right" iconGroup="fas" size="lg" />,
	SOFT_DROP: <FaIcon iconName="caret-down" iconGroup="fas" size="lg" />,
	HARD_DROP: <FaIcon iconName="angles-down" iconGroup="fas" size="lg" />,
};

const WASD_LABELS: Record<BrickfallAction, ReactNode> = {
	ROTATE: 'W', LEFT: 'A', RIGHT: 'D', SOFT_DROP: 'S',
	HARD_DROP: <FaIcon iconName="angles-down" iconGroup="fas" size="lg" />,
};

const LABEL_MAPS: Record<KeyScheme, Record<BrickfallAction, ReactNode>> = {
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
	onActionPressAction,
	onActionReleaseAction,
	onToggleKeySchemeAction,
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
				onPressAction={onActionPressAction}
				onReleaseAction={onActionReleaseAction}
			/>
			{!isPlaying && (
				<button
					className={styles.schemeToggle}
					onClick={onToggleKeySchemeAction}
					type="button"
					data-testid="key-scheme-toggle"
				>
					{keyScheme === 'arrows' ? 'use WASD' : 'use arrows'}
				</button>
			)}
		</div>
	);
};
