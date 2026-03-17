import { GHOST_NAMES, OPPOSITE_DIRECTIONS, SCATTER_CHASE_PATTERN } from '../rge-pacman-game.constants';
import type { SystemArgs } from '../../games.types';
import type { Entities, GhostEntity } from '../rge-pacman-game.types';

const getGhosts = (entities: Entities): GhostEntity[] =>
	GHOST_NAMES.map((name) => entities[name]);

export const updateMode = (entities: Entities, { time }: SystemArgs): Entities => {
	const { board } = entities;
	const delta = time.delta;

	if (board.frightenedTimer > 0) {
		board.frightenedTimer -= delta;

		if (board.frightenedTimer <= 0) {
			board.frightenedTimer = 0;
			board.ghostsEatenCombo = 0;

			for (const ghost of getGhosts(entities)) {
				if (ghost.mode === 'frightened') {
					ghost.mode = board.currentGhostMode;
				}
			}
		}

		return entities;
	}

	const phase = SCATTER_CHASE_PATTERN[board.modePhaseIndex];
	if (!phase || phase.durationMs === 0) return entities;

	board.modeTimer += delta;

	if (board.modeTimer >= phase.durationMs) {
		board.modeTimer = 0;
		board.modePhaseIndex++;

		const nextPhase = SCATTER_CHASE_PATTERN[board.modePhaseIndex];
		if (nextPhase) {
			board.currentGhostMode = nextPhase.mode;

			for (const ghost of getGhosts(entities)) {
				if (ghost.mode === 'chase' || ghost.mode === 'scatter') {
					ghost.mode = nextPhase.mode;
					ghost.direction = OPPOSITE_DIRECTIONS[ghost.direction];
				}
			}
		}
	}

	return entities;
};
