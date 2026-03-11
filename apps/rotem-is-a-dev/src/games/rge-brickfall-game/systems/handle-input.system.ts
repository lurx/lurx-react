import { ACTION_MAPS } from '../rge-brickfall-game.constants';
import type { Entities, SystemArgs } from '../rge-brickfall-game.types';
import { handleHardDrop, handleMove, handleRotate, syncGhost } from './handle-input.helpers';

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
			handleMove(piece, grid, board, action === 'LEFT' ? -1 : 1);
		}

		if (action === 'ROTATE') {
			handleRotate(piece, grid, board);
		}

		if (action === 'SOFT_DROP') {
			board.softDropping = true;
		}

		if (action === 'HARD_DROP') {
			handleHardDrop(piece, grid, board, dispatch);
		}

		syncGhost(piece, ghost, grid, board);
	}

	return entities;
};
