import { GHOST_NAMES, OPPOSITE_DIRECTIONS, SCATTER_CHASE_PATTERN } from '../rge-pacman-game.constants';
import type { SystemArgs } from '../../games.types';
import type { BoardEntity, Entities, GhostEntity } from '../rge-pacman-game.types';

const getGhosts = (entities: Entities): GhostEntity[] =>
	GHOST_NAMES.map((name) => entities[name]);

const endFrightenedMode = (ghosts: GhostEntity[], board: BoardEntity): void => {
	board.frightenedTimer = 0;
	board.ghostsEatenCombo = 0;

	for (const ghost of ghosts) {
		if (ghost.mode === 'frightened') {
			ghost.mode = board.currentGhostMode;
		}
	}
};

const applyPhaseTransition = (ghosts: GhostEntity[], board: BoardEntity): void => {
	const nextPhase = SCATTER_CHASE_PATTERN[board.modePhaseIndex];
	if (!nextPhase) return;

	board.currentGhostMode = nextPhase.mode;

	for (const ghost of ghosts) {
		if (ghost.mode !== 'chase' && ghost.mode !== 'scatter') continue;
		ghost.mode = nextPhase.mode;
		ghost.direction = OPPOSITE_DIRECTIONS[ghost.direction];
	}
};

export const updateMode = (entities: Entities, { time }: SystemArgs): Entities => {
	const { board } = entities;
	const delta = time.delta;
	const ghosts = getGhosts(entities);

	if (board.frightenedTimer > 0) {
		board.frightenedTimer -= delta;

		if (board.frightenedTimer <= 0) {
			endFrightenedMode(ghosts, board);
		}

		return entities;
	}

	const phase = SCATTER_CHASE_PATTERN[board.modePhaseIndex];
	if (!phase || phase.durationMs === 0) return entities;

	board.modeTimer += delta;

	if (board.modeTimer < phase.durationMs) return entities;

	board.modeTimer = 0;
	board.modePhaseIndex++;
	applyPhaseTransition(ghosts, board);

	return entities;
};
