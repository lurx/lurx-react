import { GLOW_COLORS, TETROMINO_COLORS } from '../rge-brickfall-game.constants';
import { getAbsoluteCells } from '../rge-brickfall-game.helpers';
import type { ActivePiece } from '../rge-brickfall-game.types';

export const PieceRenderer = ({ piece, cellSize }: { piece: ActivePiece; cellSize: number }) => {
	const cells = getAbsoluteCells(piece.type, piece.position, piece.rotation);
	const color = TETROMINO_COLORS[piece.type];
	const glow = GLOW_COLORS[piece.type];

	return (
		<>
			{cells.map((cell, index) => (
				<div
					key={`piece-${JSON.stringify(cell)}-${index}`}
					data-testid="active-piece-cell"
					style={{
						position: 'absolute',
						left: cell.x * cellSize,
						top: cell.y * cellSize,
						width: cellSize,
						height: cellSize,
						backgroundColor: color,
						borderRadius: 3,
						boxShadow: `0 0 8px ${glow}`,
					}}
				/>
			))}
		</>
	);
};
