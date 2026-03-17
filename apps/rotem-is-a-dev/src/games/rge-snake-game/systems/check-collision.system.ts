import type { SystemArgs } from '../../games.types';
import type { Entities } from '../rge-snake-game.types';

export const checkCollision = (entities: Entities, { dispatch }: SystemArgs): Entities => {
	const { snake, board } = entities;
	const head = snake.body[0];

	const hitWall =
		head.x < 0 || head.x >= board.width || head.y < 0 || head.y >= board.height;

	if (hitWall) {
		dispatch({ type: 'game-over' });
		return entities;
	}

	const bodyWithoutHead = snake.body.slice(1);
	const hitSelf = bodyWithoutHead.some(
		(segment) => segment.x === head.x && segment.y === head.y
	);

	if (hitSelf) {
		dispatch({ type: 'game-over' });
		return entities;
	}

	if (snake.body.length >= board.winLength) {
		dispatch({ type: 'game-won' });
	}

	return entities;
};
