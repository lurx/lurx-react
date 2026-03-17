import { DIRECTION_DELTAS, GHOST_BASE_SCORE, GHOST_DEATH_NUDGE, GHOST_NAMES } from '../rge-pacman-game.constants';
import type { SystemArgs } from '../../games.types';
import type { Entities } from '../rge-pacman-game.types';

export const checkGhostCollision = (entities: Entities, { dispatch }: SystemArgs): Entities => {
	const { board, pacman } = entities;

	if (pacman.dying) return entities;

	for (const name of GHOST_NAMES) {
		const ghost = entities[name];

		if (ghost.position.x !== pacman.position.x || ghost.position.y !== pacman.position.y) {
			continue;
		}

		if (ghost.mode === 'house' || ghost.mode === 'eaten') {
			continue;
		}

		if (ghost.mode === 'frightened') {
			ghost.mode = 'eaten';
			const comboMultiplier = Math.pow(2, board.ghostsEatenCombo);
			board.score += GHOST_BASE_SCORE * comboMultiplier;
			board.ghostsEatenCombo++;
			dispatch({ type: 'score-updated' });
			continue;
		}

		const delta = DIRECTION_DELTAS[ghost.direction];
		ghost.position.x -= delta.x * GHOST_DEATH_NUDGE;
		ghost.position.y -= delta.y * GHOST_DEATH_NUDGE;

		board.lives--;
		pacman.dying = true;
		dispatch({ type: 'pacman-died' });
		return entities;
	}

	return entities;
};
