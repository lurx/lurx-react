import { GHOST_OPACITY, TETROMINO_COLORS } from '../rge-brickfall-game.constants';
import { getAbsoluteCells } from '../rge-brickfall-game.helpers';
import type { Position } from '../../games.types';
import type { RotationState, TetrominoType } from '../rge-brickfall-game.types';

export const GhostRenderer = ({
	position,
	type,
	rotation,
	cellSize,
}: {
	position: Position;
	type: TetrominoType;
	rotation: RotationState;
	cellSize: number;
}) => {
	const cells = getAbsoluteCells(type, position, rotation);
	const color = TETROMINO_COLORS[type];

	return (
		<>
			{cells.map((cell, index) => (
				<div
					key={`ghost-${JSON.stringify(cell)}-${index}`}
					data-testid="ghost-cell"
					style={{
						position: 'absolute',
						left: cell.x * cellSize,
						top: cell.y * cellSize,
						width: cellSize,
						height: cellSize,
						backgroundColor: 'transparent',
						border: `1px solid ${color}`,
						borderRadius: 3,
						opacity: GHOST_OPACITY,
					}}
				/>
			))}
		</>
	);
};
