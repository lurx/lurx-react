import type { Position, SystemArgs } from '../../games.types';
import type { Entities } from '../rge-snake-game.types';

const positionKey = (pos: Position): string => `${pos.x},${pos.y}`;

const spawnFood = (snake: Position[], gridCols: number, gridRows: number): Position => {
	const occupied = new Set(snake.map(positionKey));
	const emptyCells: Position[] = [];

	for (let x = 0; x < gridCols; x++) {
		for (let y = 0; y < gridRows; y++) {
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
		entities.food.position = spawnFood(entities.snake.body, entities.board.width, entities.board.height);
		dispatch({ type: 'food-eaten' });
	}

	return entities;
};
