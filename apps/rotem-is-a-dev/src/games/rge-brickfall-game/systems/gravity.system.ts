import { SOFT_DROP_TICK_MS } from '../rge-brickfall-game.constants';
import { collides, getAbsoluteCells, getTickMsForLevel } from '../rge-brickfall-game.helpers';
import type { Entities, SystemArgs } from '../rge-brickfall-game.types';

export const gravity = (entities: Entities, { events, dispatch, time }: SystemArgs): Entities => {
	if (entities.playfield.clearingRows.length > 0) return entities;

	const hasLockEvent = events.some((event) => event.type === 'lock-piece');
	if (hasLockEvent) return entities;

	const { board, activePiece, playfield } = entities;
	const { piece } = activePiece;
	const { grid } = playfield;

	const tickMs = board.softDropping ? SOFT_DROP_TICK_MS : getTickMsForLevel(board.level);
	const elapsed = time.current - board.lastGravityTime;

	if (elapsed < tickMs) return entities;

	board.lastGravityTime = time.current;

	const nextPosition = { x: piece.position.x, y: piece.position.y + 1 };
	const cells = getAbsoluteCells(piece.type, nextPosition, piece.rotation);

	if (collides(cells, grid, board.width, board.height)) {
		dispatch({ type: 'piece-landed' });
	} else {
		piece.position = nextPosition;
	}

	return entities;
};
