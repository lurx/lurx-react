import type { SystemArgs } from '../../games.types';
import type { Entities } from '../rge-brickfall-game.types';
import { handleHardDrop, handleMove, handleRotate, syncGhost } from './handle-input.helpers';

export const handleInput = (entities: Entities, { dispatch }: SystemArgs): Entities => {
	if (entities.playfield.clearingRows.length > 0) return entities;

	const { activePiece, playfield, board, ghost } = entities;
	const { grid } = playfield;
	const { piece } = activePiece;
	const { pendingActions } = board;

	for (const action of pendingActions) {
		if (action === 'LEFT' || action === 'RIGHT') {
			handleMove(piece, grid, board, action === 'LEFT' ? -1 : 1);
		}

		if (action === 'ROTATE') {
			handleRotate(piece, grid, board);
		}

		if (action === 'HARD_DROP') {
			handleHardDrop(piece, grid, board, dispatch);
		}

		syncGhost(piece, ghost, grid, board);
	}

	board.pendingActions = [];

	return entities;
};
