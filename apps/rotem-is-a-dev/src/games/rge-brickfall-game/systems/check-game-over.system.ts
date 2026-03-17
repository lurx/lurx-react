import { getAbsoluteCells } from '../rge-brickfall-game.helpers';
import type { SystemArgs } from '../../games.types';
import type { Entities } from '../rge-brickfall-game.types';

export const checkGameOver = (entities: Entities, { dispatch }: SystemArgs): Entities => {
	if (entities.playfield.clearingRows.length > 0) return entities;

	const { activePiece, playfield, board } = entities;
	const { piece } = activePiece;
	const { grid } = playfield;

	const cells = getAbsoluteCells(piece.type, piece.position, piece.rotation);

	const overlaps = cells.some(
		(cell) =>
			cell.y >= 0 &&
			cell.y < board.height &&
			cell.x >= 0 &&
			cell.x < board.width &&
			grid[cell.y][cell.x] !== null,
	);

	if (overlaps) {
		dispatch({ type: 'game-over' });
	}

	return entities;
};
