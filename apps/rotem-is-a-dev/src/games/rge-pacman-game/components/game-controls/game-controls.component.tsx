import type { ReactNode } from 'react';
import { FaIcon } from '@/app/components/fa-icon';
import { ArrowKeyGrid } from '../../../components/arrow-key-grid';
import type { ArrowKeyGridItem } from '../../../components/arrow-key-grid';
import type { Direction, KeyScheme } from '../../rge-pacman-game.types';
import type { GameControlsProps } from './game-controls.types';
import styles from '../../rge-pacman-game.module.scss';

const ARROW_LABELS: Record<Direction, ReactNode> = {
	UP: <FaIcon iconName="caret-up" iconGroup="fas" size="lg" />,
	LEFT: <FaIcon iconName="caret-left" iconGroup="fas" size="lg" />,
	RIGHT: <FaIcon iconName="caret-right" iconGroup="fas" size="lg" />,
	DOWN: <FaIcon iconName="caret-down" iconGroup="fas" size="lg" />,
};

const WASD_LABELS: Record<Direction, ReactNode> = {
	UP: 'W',
	LEFT: 'A',
	RIGHT: 'D',
	DOWN: 'S',
};

const LABEL_MAPS: Record<KeyScheme, Record<Direction, ReactNode>> = {
	arrows: ARROW_LABELS,
	wasd: WASD_LABELS,
};

const LIFE_EMOJI = '\u{1F7E1}';

const buildItems = (keyScheme: KeyScheme): ArrowKeyGridItem<Direction>[] => {
	const labels = LABEL_MAPS[keyScheme];

	return [
		{ value: 'UP', label: labels.UP, testId: 'action-up' },
		{ value: 'LEFT', label: labels.LEFT, testId: 'action-left' },
		{ value: 'RIGHT', label: labels.RIGHT, testId: 'action-right' },
		{ value: 'DOWN', label: labels.DOWN, testId: 'action-down' },
	];
};

export const GameControls = ({
	score,
	lives,
	activeAction,
	keyScheme,
	isPlaying,
	onToggleKeyScheme,
}: GameControlsProps) => {
	const items = buildItems(keyScheme);

	return (
		<div className={styles.controls} data-testid="game-controls">
			<div className={styles.stats}>
				<div className={styles.score} data-testid="score">SCORE: {score}</div>
				<div className={styles.statLine} data-testid="lives">
					LIVES: {LIFE_EMOJI.repeat(lives)}
				</div>
			</div>
			<ArrowKeyGrid items={items} activeValue={activeAction} />
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
