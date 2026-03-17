import type { Direction, Position } from '@/games/games.types';
import {
	ALL_DIRECTIONS,
	DIRECTION_DELTAS,
	GHOST_DOOR_POSITION,
	GHOST_HOUSE_CENTER,
	OPPOSITE_DIRECTIONS,
} from '../rge-pacman-game.constants';
import {
	canMove,
	chooseBestDirection,
	euclideanDistance,
	getGhostTarget,
	getValidDirections,
	wrapPosition,
} from '../rge-pacman-game.helpers';
import type { BoardEntity, CellType, Entities, GhostEntity } from '../rge-pacman-game.types';

export const moveGhostInHouse = (
	ghost: GhostEntity,
	dotsEaten: number,
): void => {
	if (dotsEaten >= ghost.releaseThreshold) {
		const distToDoor = euclideanDistance(ghost.position, GHOST_DOOR_POSITION);
		const ARRIVAL_THRESHOLD = 1;

		if (distToDoor <= ARRIVAL_THRESHOLD) {
			ghost.position = { ...GHOST_DOOR_POSITION };
			ghost.position.y = GHOST_DOOR_POSITION.y - 1;
			ghost.mode = 'scatter';
			ghost.direction = 'LEFT';
		} else {
			ghost.position = {
				x: GHOST_DOOR_POSITION.x,
				y: ghost.position.y - 1,
			};
		}
	}
};

export const moveEatenGhost = (
	ghost: GhostEntity,
	grid: CellType[][],
	width: number,
	height: number,
	currentMode: BoardEntity['currentGhostMode'],
): void => {
	const distToHouse = euclideanDistance(ghost.position, GHOST_HOUSE_CENTER);
	const ARRIVAL_THRESHOLD = 1;

	if (distToHouse <= ARRIVAL_THRESHOLD) {
		ghost.position = { ...GHOST_HOUSE_CENTER };
		ghost.mode = currentMode;
		ghost.direction = 'UP';
		return;
	}

	const validDirs = getEatenValidDirections(ghost, grid, width, height);
	const bestDir = chooseBestDirection(validDirs, ghost.position, GHOST_HOUSE_CENTER, width);
	ghost.direction = bestDir;

	const delta = DIRECTION_DELTAS[bestDir];
	ghost.position = wrapPosition(
		{ x: ghost.position.x + delta.x, y: ghost.position.y + delta.y },
		width,
	);
};

const getEatenValidDirections = (
	ghost: GhostEntity,
	grid: CellType[][],
	width: number,
	height: number,
): Direction[] => {
	const opposite = OPPOSITE_DIRECTIONS[ghost.direction];

	const valid = ALL_DIRECTIONS.filter(
		(dir) => dir !== opposite && canMove(grid, ghost.position, dir, width, height, true),
	);

	return valid.length > 0 ? valid : [opposite];
};

export const moveFrightenedGhost = (
	ghost: GhostEntity,
	grid: CellType[][],
	width: number,
	height: number,
): void => {
	const validDirs = getValidDirections(
		grid,
		ghost.position,
		ghost.direction,
		width,
		height,
		true,
	);

	const directions = validDirs.length > 0 ? validDirs : [OPPOSITE_DIRECTIONS[ghost.direction]];
	const randomDir = directions[Math.floor(Math.random() * directions.length)];
	ghost.direction = randomDir;

	const delta = DIRECTION_DELTAS[randomDir];
	ghost.position = wrapPosition(
		{ x: ghost.position.x + delta.x, y: ghost.position.y + delta.y },
		width,
	);
};

export const moveTargetingGhost = (
	ghost: GhostEntity,
	target: Position,
	grid: CellType[][],
	width: number,
	height: number,
): void => {
	const validDirs = getValidDirections(
		grid,
		ghost.position,
		ghost.direction,
		width,
		height,
		true,
	);

	const directions = validDirs.length > 0 ? validDirs : [OPPOSITE_DIRECTIONS[ghost.direction]];
	const bestDir = chooseBestDirection(directions, ghost.position, target, width);
	ghost.direction = bestDir;

	const delta = DIRECTION_DELTAS[bestDir];
	ghost.position = wrapPosition(
		{ x: ghost.position.x + delta.x, y: ghost.position.y + delta.y },
		width,
	);
};

export const getTargetForGhost = (
	ghost: GhostEntity,
	entities: Entities,
): Position =>
	getGhostTarget(
		ghost.name,
		ghost.position,
		entities.pacman.position,
		entities.pacman.direction,
		entities.blinky.position,
		ghost.scatterTarget,
		ghost.mode as BoardEntity['currentGhostMode'],
	);
