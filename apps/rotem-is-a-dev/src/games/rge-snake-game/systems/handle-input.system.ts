import { DIRECTION_MAPS, OPPOSITE_DIRECTIONS } from '../rge-snake-game.constants';
import type { Entities, SystemArgs } from '../rge-snake-game.types';

export const handleInput = (entities: Entities, { input }: SystemArgs): Entities => {
	const keyDownEvents = input.filter((event) => event.name === 'onKeyDown');
	const directionMap = DIRECTION_MAPS[entities.board.keyScheme];

	for (const event of keyDownEvents) {
		const key = event.payload.key ?? '';
		const newDirection = directionMap[key];

		if (!newDirection) continue;

		const currentDirection = entities.snake.direction;
		const isReversal = OPPOSITE_DIRECTIONS[newDirection] === currentDirection;

		if (!isReversal) {
			entities.snake.direction = newDirection;
			break;
		}
	}

	return entities;
};
