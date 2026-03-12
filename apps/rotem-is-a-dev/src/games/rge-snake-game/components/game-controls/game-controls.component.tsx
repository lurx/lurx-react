import { ArrowKeyGrid } from '../../../components/arrow-key-grid';
import type { ArrowKeyGridItem } from '../../../components/arrow-key-grid';
import type { Direction, KeyScheme } from '../../rge-snake-game.types';
import type { GameControlsProps } from './game-controls.types';
import styles from '../../rge-snake-game.module.scss';

const ARROW_LABELS: Record<Direction, string> = {
	UP: '\u25B2', LEFT: '\u25C0', RIGHT: '\u25B6', DOWN: '\u25BC',
};

const WASD_LABELS: Record<Direction, string> = {
	UP: 'W', LEFT: 'A', RIGHT: 'D', DOWN: 'S',
};

const LABEL_MAPS: Record<KeyScheme, Record<Direction, string>> = {
	arrows: ARROW_LABELS,
	wasd: WASD_LABELS,
};

const buildItems = (keyScheme: KeyScheme): ArrowKeyGridItem<Direction>[] => {
	const labels = LABEL_MAPS[keyScheme];
	return [
		{ value: 'UP', label: labels.UP, testId: 'arrow-up' },
		{ value: 'LEFT', label: labels.LEFT, testId: 'arrow-left' },
		{ value: 'RIGHT', label: labels.RIGHT, testId: 'arrow-right' },
		{ value: 'DOWN', label: labels.DOWN, testId: 'arrow-down' },
	];
};

export const GameControls = ({
	score,
	onDirectionPress,
	activeDirection,
	keyScheme,
	isPlaying,
	onToggleKeyScheme,
}: GameControlsProps) => {
	const items = buildItems(keyScheme);

	return (
		<div className={styles.controls} data-testid="game-controls">
			<div className={styles.score} data-testid="score">
				SCORE: {score}
			</div>
			<ArrowKeyGrid
				items={items}
				activeValue={activeDirection}
				onPress={onDirectionPress}
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
