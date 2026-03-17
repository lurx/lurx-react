import {
	DOT_SCORE,
	FRIGHTENED_DURATION_MS,
	GHOST_NAMES,
	OPPOSITE_DIRECTIONS,
	POWER_SCORE,
} from '../rge-pacman-game.constants';
import type { Entities, SystemArgs } from '../rge-pacman-game.types';

export const checkDotCollision = (entities: Entities, { dispatch }: SystemArgs): Entities => {
	const { board, pacman, maze } = entities;
	const tile = maze.grid[pacman.position.y]?.[pacman.position.x];

	if (tile === 'dot') {
		maze.grid[pacman.position.y][pacman.position.x] = 'empty';
		board.score += DOT_SCORE;
		maze.dotsRemaining--;
		board.dotsEaten++;
		dispatch({ type: 'score-updated' });
	}

	if (tile === 'power') {
		maze.grid[pacman.position.y][pacman.position.x] = 'empty';
		board.score += POWER_SCORE;
		maze.dotsRemaining--;
		board.dotsEaten++;
		board.frightenedTimer = FRIGHTENED_DURATION_MS;
		board.ghostsEatenCombo = 0;

		for (const name of GHOST_NAMES) {
			const ghost = entities[name];
			if (ghost.mode === 'chase' || ghost.mode === 'scatter') {
				ghost.mode = 'frightened';
				ghost.direction = OPPOSITE_DIRECTIONS[ghost.direction];
			}
		}

		dispatch({ type: 'score-updated' });
	}

	return entities;
};
