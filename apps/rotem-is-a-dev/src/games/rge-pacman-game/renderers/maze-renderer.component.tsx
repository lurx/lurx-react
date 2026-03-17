import classNames from 'classnames';
import type { CellType, MazeRendererProps } from '../rge-pacman-game.types';
import styles from '../rge-pacman-game.module.scss';

const CELL_CLASS: Partial<Record<CellType, string>> = {
	wall: styles.wall,
	dot: styles.dot,
	power: styles.power,
};

export const MazeRenderer = ({
	grid,
	cellSize,
}: MazeRendererProps) => (
	<>
		{grid.map((row, rowIndex) =>
			row.map((cell, colIndex) => {
				const cellClass = CELL_CLASS[cell];

				if (!cellClass) return null;

				return (
					<div
						key={`${cell}-${rowIndex}-${colIndex}`}
						data-testid={`maze-${cell}`}
						className={classNames(styles.mazeCell, cellClass, {
							[styles.powerPellet]: cell === 'power',
						})}
						style={{
							left: colIndex * cellSize,
							top: rowIndex * cellSize,
						}}
					/>
				);
			}),
		)}
	</>
);
