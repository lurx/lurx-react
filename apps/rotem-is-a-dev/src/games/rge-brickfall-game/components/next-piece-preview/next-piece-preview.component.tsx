import { TETROMINO_COLORS, TETROMINO_SHAPES } from '../../rge-brickfall-game.constants';
import type { NextPiecePreviewProps } from './next-piece-preview.types';

const PREVIEW_SIZE = 4;
const PREVIEW_CELL_SIZE = 16;

export const NextPiecePreview = ({ type }: NextPiecePreviewProps) => {
	const cells = TETROMINO_SHAPES[type][0];
	const color = TETROMINO_COLORS[type];

	return (
		<div
			data-testid="next-piece-preview"
			style={{
				position: 'relative',
				width: PREVIEW_SIZE * PREVIEW_CELL_SIZE,
				height: PREVIEW_SIZE * PREVIEW_CELL_SIZE,
			}}
		>
			{cells.map((cell) => (
				<div
					key={`preview-${cell.x}-${cell.y}`}
					data-testid="preview-cell"
					style={{
						position: 'absolute',
						left: cell.x * PREVIEW_CELL_SIZE,
						top: cell.y * PREVIEW_CELL_SIZE,
						width: PREVIEW_CELL_SIZE,
						height: PREVIEW_CELL_SIZE,
						backgroundColor: color,
						borderRadius: 2,
					}}
				/>
			))}
		</div>
	);
};
