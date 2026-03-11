import { ACTION_MAPS } from '../rge-brickfall-game.constants';
import {
	collides,
	getAbsoluteCells,
	getGhostPosition,
	getNextRotation,
} from '../rge-brickfall-game.helpers';
import type { Entities, SystemArgs } from '../rge-brickfall-game.types';

export const handleInput = (entities: Entities, { input, dispatch }: SystemArgs): Entities => {
	if (entities.playfield.clearingRows.length > 0) return entities;

	const keyDownEvents = input.filter((event) => event.name === 'onKeyDown');
	const actionMap = ACTION_MAPS[entities.board.keyScheme];
	const { activePiece, playfield, board, ghost } = entities;
	const { grid } = playfield;
	const { piece } = activePiece;

	for (const event of keyDownEvents) {
		const key = event.payload.key ?? '';
		const action = actionMap[key];

		if (!action) continue;

		if (action === 'LEFT' || action === 'RIGHT') {
			const deltaX = action === 'LEFT' ? -1 : 1;
			const newPosition = { x: piece.position.x + deltaX, y: piece.position.y };
			const cells = getAbsoluteCells(piece.type, newPosition, piece.rotation);

			if (!collides(cells, grid, board.width, board.height)) {
				piece.position = newPosition;
			}
		}

		if (action === 'ROTATE') {
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
		}

		if (action === 'SOFT_DROP') {
			board.softDropping = true;
		}

		if (action === 'HARD_DROP') {
			const ghostPosition = getGhostPosition(piece, grid, board.width, board.height);
			piece.position = ghostPosition;
			dispatch({ type: 'lock-piece' });
		}

		const updatedGhostPosition = getGhostPosition(piece, grid, board.width, board.height);
		ghost.position = updatedGhostPosition;
		ghost.type = piece.type;
		ghost.rotation = piece.rotation;
	}

	return entities;
};
