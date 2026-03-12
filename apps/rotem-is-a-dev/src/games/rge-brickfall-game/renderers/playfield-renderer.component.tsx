import type { PlayfieldGrid } from '../rge-brickfall-game.types';
import styles from '../rge-brickfall-game.module.scss';

export const PlayfieldRenderer = ({
	grid,
	cellSize,
	clearingRows = [],
}: {
	grid: PlayfieldGrid;
	cellSize: number;
	clearingRows?: number[];
}) => (
	<>
		{grid.map((row, rowIndex) =>
			row.map((cell, colIndex) => {
				if (cell === null) return null;

				const isClearing = clearingRows.includes(rowIndex);

				return (
					<div
						key={`cell-${rowIndex}-${colIndex}`}
						data-testid="playfield-cell"
						className={isClearing ? styles.clearingCell : undefined}
						style={{
							position: 'absolute',
							left: colIndex * cellSize,
							top: rowIndex * cellSize,
							width: cellSize,
							height: cellSize,
							backgroundColor: cell,
							borderRadius: 2,
						}}
					/>
				);
			}),
		)}
	</>
);
