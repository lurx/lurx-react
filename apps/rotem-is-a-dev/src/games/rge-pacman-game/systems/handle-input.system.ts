import { canMove } from '../rge-pacman-game.helpers';
import type { SystemArgs } from '../../games.types';
import type { Entities } from '../rge-pacman-game.types';

export const handleInput = (entities: Entities, _args: SystemArgs): Entities => {
	const { board, pacman, maze } = entities;
	const { pendingActions } = board;

	const lastAction = pendingActions.at(-1);

	if (!lastAction) return entities;

	if (canMove(maze.grid, pacman.position, lastAction, board.width, board.height)) {
		pacman.direction = lastAction;
		pacman.nextDirection = null;
	} else {
		pacman.nextDirection = lastAction;
	}

	board.pendingActions = [];

	return entities;
};
