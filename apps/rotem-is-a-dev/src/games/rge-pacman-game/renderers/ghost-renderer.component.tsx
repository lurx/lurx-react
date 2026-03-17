import classNames from 'classnames';
import type { Direction } from '../../game-controls.types';
import { FRIGHTENED_FLASH_MS } from '../rge-pacman-game.constants';
import type { GhostRendererProps } from '../rge-pacman-game.types';
import styles from '../rge-pacman-game.module.scss';

const PUPIL_CLASS: Record<Direction, string> = {
	UP: styles.pupilUp,
	DOWN: styles.pupilDown,
	LEFT: styles.pupilLeft,
	RIGHT: styles.pupilRight,
};

export const GhostRenderer = ({
	name,
	position,
	direction,
	mode,
	frightenedTimer,
	cellSize,
}: GhostRendererProps) => {
	if (mode === 'house') return null;

	const isFlashing = mode === 'frightened' && frightenedTimer > 0 && frightenedTimer <= FRIGHTENED_FLASH_MS;

	const className = classNames(styles.ghost, PUPIL_CLASS[direction], {
		[styles[name]]: mode !== 'frightened' && mode !== 'eaten',
		[styles.frightened]: mode === 'frightened',
		[styles.eaten]: mode === 'eaten',
		[styles.frightenedFlash]: isFlashing,
	});

	return (
		<div
			data-testid={`ghost-${name}`}
			className={className}
			style={{
				left: position.x * cellSize,
				top: position.y * cellSize,
			}}
		/>
	);
};
