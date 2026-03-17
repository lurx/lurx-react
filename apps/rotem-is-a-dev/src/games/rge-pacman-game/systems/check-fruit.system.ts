import {
	FRUIT_CONFIG,
	FRUIT_DURATION_MS,
	FRUIT_POSITION,
	FRUIT_SPAWN_DOT_THRESHOLDS,
} from '../rge-pacman-game.constants';
import type { Entities, SystemArgs } from '../rge-pacman-game.types';

export const checkFruit = (entities: Entities, { dispatch, time }: SystemArgs): Entities => {
	const { board, pacman, fruit } = entities;

	if (fruit.active) {
		if (
			pacman.position.x === fruit.position.x &&
			pacman.position.y === fruit.position.y
		) {
			board.score += FRUIT_CONFIG[fruit.fruitType].score;
			fruit.active = false;
			dispatch({ type: 'score-updated' });
			return entities;
		}

		if (time.current - fruit.spawnedAt >= FRUIT_DURATION_MS) {
			fruit.active = false;
		}

		return entities;
	}

	if (
		board.dotsEaten >= FRUIT_SPAWN_DOT_THRESHOLDS[0] &&
		!board.fruitSpawned70
	) {
		board.fruitSpawned70 = true;
		fruit.active = true;
		fruit.position = { ...FRUIT_POSITION };
		fruit.spawnedAt = time.current;
	}

	if (
		board.dotsEaten >= FRUIT_SPAWN_DOT_THRESHOLDS[1] &&
		!board.fruitSpawned170
	) {
		board.fruitSpawned170 = true;
		fruit.active = true;
		fruit.position = { ...FRUIT_POSITION };
		fruit.spawnedAt = time.current;
	}

	return entities;
};
