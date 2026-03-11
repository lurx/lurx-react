import {
	collides,
	getAbsoluteCells,
	getGhostPosition,
	getNextRotation,
} from '../rge-brickfall-game.helpers';
import type { ActivePiece, BoardEntity, GhostEntity, PlayfieldGrid } from '../rge-brickfall-game.types';

export const handleMove = (
	piece: ActivePiece,
	grid: PlayfieldGrid,
	board: BoardEntity,
	deltaX: number,
): void => {
	const newPosition = { x: piece.position.x + deltaX, y: piece.position.y };
	const cells = getAbsoluteCells(piece.type, newPosition, piece.rotation);

	if (!collides(cells, grid, board.width, board.height)) {
		piece.position = newPosition;
	}
};

export const handleRotate = (
	piece: ActivePiece,
	grid: PlayfieldGrid,
	board: BoardEntity,
): void => {
	const nextRotation = getNextRotation(piece.rotation);
	const offsets = [0, -1, 1];

	for (const offsetX of offsets) {
		const kickedPosition = { x: piece.position.x + offsetX, y: piece.position.y };
		const cells = getAbsoluteCells(piece.type, kickedPosition, nextRotation);

		if (!collides(cells, grid, board.width, board.height)) {
			piece.rotation = nextRotation;
			piece.position = kickedPosition;
			break;
		}
	}
};

export const handleHardDrop = (
	piece: ActivePiece,
	grid: PlayfieldGrid,
	board: BoardEntity,
	dispatch: (event: { type: string }) => void,
): void => {
	const ghostPosition = getGhostPosition(piece, grid, board.width, board.height);
	piece.position = ghostPosition;
	dispatch({ type: 'lock-piece' });
};

export const syncGhost = (
	piece: ActivePiece,
	ghost: GhostEntity,
	grid: PlayfieldGrid,
	board: BoardEntity,
): void => {
	const updatedGhostPosition = getGhostPosition(piece, grid, board.width, board.height);
	ghost.position = updatedGhostPosition;
	ghost.type = piece.type;
	ghost.rotation = piece.rotation;
};
