import type { Direction, Position, SystemArgs } from '../../games.types';
import type { Entities } from '../rge-snake-game.types';

const DIRECTION_DELTAS: Record<Direction, Position> = {
	UP: { x: 0, y: -1 },
	DOWN: { x: 0, y: 1 },
	LEFT: { x: -1, y: 0 },
	RIGHT: { x: 1, y: 0 },
};

export const moveSnake = (entities: Entities, { time }: SystemArgs): Entities => {
	if (time.current - entities.board.lastTickTime < entities.board.tickMs) return entities;
	entities.board.lastTickTime = time.current;

	const { snake } = entities;
	const head = snake.body[0];
	const delta = DIRECTION_DELTAS[snake.direction];
	const newHead: Position = { x: head.x + delta.x, y: head.y + delta.y };

	snake.body = [newHead, ...snake.body];

	if (snake.growing) {
		snake.growing = false;
	} else {
		snake.body.pop();
	}

	return entities;
};
