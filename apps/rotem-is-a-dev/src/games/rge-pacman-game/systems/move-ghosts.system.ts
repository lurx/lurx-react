import { GHOST_NAMES } from '../rge-pacman-game.constants';
import type { Entities, GhostEntity, SystemArgs } from '../rge-pacman-game.types';
import {
	getTargetForGhost,
	moveEatenGhost,
	moveFrightenedGhost,
	moveGhostInHouse,
	moveTargetingGhost,
} from './move-ghosts.helpers';

const shouldTickGhost = (ghost: GhostEntity, entities: Entities, currentTime: number): boolean => {
	const { board } = entities;

	if (ghost.mode === 'eaten') {
		return currentTime - board.lastGhostTick >= board.eatenTickMs;
	}

	if (ghost.mode === 'frightened') {
		return currentTime - board.lastGhostTick >= board.frightenedTickMs;
	}

	return currentTime - board.lastGhostTick >= board.ghostTickMs;
};

export const moveGhosts = (entities: Entities, { time }: SystemArgs): Entities => {
	const { board, maze } = entities;
	const { grid } = maze;

	if (board.lastGhostTick === 0) {
		board.lastGhostTick = time.current;
		return entities;
	}

	const anyGhostReady = GHOST_NAMES.some((name) =>
		shouldTickGhost(entities[name], entities, time.current),
	);

	if (!anyGhostReady) return entities;

	board.lastGhostTick = time.current;

	for (const name of GHOST_NAMES) {
		const ghost = entities[name];

		if (ghost.mode === 'house') {
			moveGhostInHouse(ghost, board.dotsEaten);
			continue;
		}

		if (ghost.mode === 'eaten') {
			moveEatenGhost(ghost, grid, board.width, board.height, board.currentGhostMode);
			continue;
		}

		if (ghost.mode === 'frightened') {
			moveFrightenedGhost(ghost, grid, board.width, board.height);
			continue;
		}

		const target = getTargetForGhost(ghost, entities);
		moveTargetingGhost(ghost, target, grid, board.width, board.height);
	}

	return entities;
};
