import { DIRECTION_DELTAS } from '../rge-pacman-game.constants';
import { canMove, wrapPosition } from '../rge-pacman-game.helpers';
import type { Entities, SystemArgs } from '../rge-pacman-game.types';

export const movePacman = (entities: Entities, { time }: SystemArgs): Entities => {
	const { board, pacman, maze } = entities;

	if (board.lastPacmanTick === 0) {
		board.lastPacmanTick = time.current;
		return entities;
	}

	const elapsed = time.current - board.lastPacmanTick;
	if (elapsed < board.pacmanTickMs) return entities;

	board.lastPacmanTick = time.current;

	if (
		pacman.nextDirection &&
		canMove(maze.grid, pacman.position, pacman.nextDirection, board.width, board.height)
	) {
		pacman.direction = pacman.nextDirection;
		pacman.nextDirection = null;
	}

	if (!canMove(maze.grid, pacman.position, pacman.direction, board.width, board.height)) {
		return entities;
	}

	const delta = DIRECTION_DELTAS[pacman.direction];
	const nextPos = {
		x: pacman.position.x + delta.x,
		y: pacman.position.y + delta.y,
	};

	pacman.position = wrapPosition(nextPos, board.width);

	return entities;
};
