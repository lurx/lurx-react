import classNames from 'classnames';
import type { Direction } from '../../games.types';
import type { PacmanRendererProps } from '../rge-pacman-game.types';
import styles from '../rge-pacman-game.module.scss';

const DIRECTION_CLASS: Record<Direction, string> = {
	RIGHT: styles.dirRight,
	DOWN: styles.dirDown,
	LEFT: styles.dirLeft,
	UP: styles.dirUp,
};

export const PacmanRenderer = ({
	position,
	direction,
	dying,
	cellSize,
}: PacmanRendererProps) => (
	<div
		data-testid="pacman"
		className={classNames(styles.pacman, DIRECTION_CLASS[direction], {
			[styles.dying]: dying,
		})}
		style={{
			left: position.x * cellSize,
			top: position.y * cellSize,
		}}
	/>
);
