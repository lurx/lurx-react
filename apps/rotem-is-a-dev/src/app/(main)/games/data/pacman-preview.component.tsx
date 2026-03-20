import { CELL_SIZE } from '@/games/rge-pacman-game/rge-pacman-game.constants';
import styles from '@/games/rge-pacman-game/rge-pacman-game.module.scss';

const PREVIEW_CELL_SIZE = CELL_SIZE * 2;
const COLS = 8;
const ROWS = 3;
const MID = 1;

const DOT_SIZE = 8;
const DOT_OFFSET = (PREVIEW_CELL_SIZE - DOT_SIZE) / 2;

export const PacmanPreview = () => (
	<div
		aria-hidden="true"
		style={{
			'--board-cell-size': `${PREVIEW_CELL_SIZE}px`,
			width: COLS * PREVIEW_CELL_SIZE,
			height: ROWS * PREVIEW_CELL_SIZE,
			position: 'relative',
			backgroundColor: '#000',
			border: '1px solid var(--border)',
			borderRadius: 'var(--radius-md)',
			overflow: 'hidden',
			boxShadow: 'inset 1px 5px 11px 0 rgba(2, 18, 27, 0.71)',
			pointerEvents: 'none',
		}}
	>
		{/* Pellet */}
		<div
			style={{
				position: 'absolute',
				left: 0 * PREVIEW_CELL_SIZE + DOT_OFFSET,
				top: MID * PREVIEW_CELL_SIZE + DOT_OFFSET,
				width: DOT_SIZE,
				height: DOT_SIZE,
				backgroundColor: '#FFF',
				borderRadius: '50%',
			}}
		/>

		{/* Pac-Man */}
		<div
			className={`${styles.pacman} ${styles.dirLeft}`}
			style={{ left: 1 * PREVIEW_CELL_SIZE, top: MID * PREVIEW_CELL_SIZE }}
		/>

		{/* Ghosts */}
		<div
			className={`${styles.ghost} ${styles.blinky}`}
			style={{ left: 3 * PREVIEW_CELL_SIZE, top: MID * PREVIEW_CELL_SIZE }}
		/>
		<div
			className={`${styles.ghost} ${styles.pinky}`}
			style={{ left: 4 * PREVIEW_CELL_SIZE + 10, top: MID * PREVIEW_CELL_SIZE }}
		/>
		<div
			className={`${styles.ghost} ${styles.inky}`}
			style={{ left: 5 * PREVIEW_CELL_SIZE + 20, top: MID * PREVIEW_CELL_SIZE }}
		/>
		<div
			className={`${styles.ghost} ${styles.clyde}`}
			style={{ left: 6 * PREVIEW_CELL_SIZE + 30, top: MID * PREVIEW_CELL_SIZE }}
		/>
	</div>
);
