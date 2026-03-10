import { GRID_COLS, GRID_ROWS } from '../rge-snake-game.constants';
import type { Entities, Position, SystemArgs } from '../rge-snake-game.types';

const positionKey = (pos: Position): string => `${pos.x},${pos.y}`;

const spawnFood = (snake: Position[]): Position => {
	const occupied = new Set(snake.map(positionKey));
	const emptyCells: Position[] = [];

	for (let x = 0; x < GRID_COLS; x++) {
		for (let y = 0; y < GRID_ROWS; y++) {
			if (!occupied.has(positionKey({ x, y }))) {
				emptyCells.push({ x, y });
			}
		}
	}

	return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

export const checkFood = (entities: Entities, { dispatch }: SystemArgs): Entities => {
	const head = entities.snake.body[0];
	const foodPos = entities.food.position;

	if (head.x === foodPos.x && head.y === foodPos.y) {
		entities.snake.growing = true;
		entities.food.position = spawnFood(entities.snake.body);
		dispatch({ type: 'food-eaten' });
	}

	return entities;
};
