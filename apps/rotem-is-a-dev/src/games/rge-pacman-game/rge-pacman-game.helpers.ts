import type { Direction, Position } from '../games.types';
import {
	ALL_DIRECTIONS,
	DIRECTION_DELTAS,
	GHOST_CONFIG,
	OPPOSITE_DIRECTIONS,
	PACMAN_START,
} from './rge-pacman-game.constants';
import type { BoardEntity, CellType, Entities, GhostName } from './rge-pacman-game.types';

const CELL_TYPE_MAP: Record<number, CellType> = {
	0: 'wall',
	1: 'dot',
	2: 'power',
	3: 'empty',
	4: 'ghost-house',
	5: 'ghost-door',
	6: 'tunnel',
};

export const isPassable = (cell: CellType, isGhost = false): boolean => {
	if (cell === 'wall') return false;
	if (cell === 'ghost-door') return isGhost;
	return true;
};

export const getTileAt = (grid: CellType[][], tileX: number, tileY: number): CellType | null => {
	if (tileY < 0 || tileY >= grid.length) return null;
	if (tileX < 0 || tileX >= grid[0].length) return null;
	return grid[tileY][tileX];
};

export const canMove = (
	grid: CellType[][],
	pos: Position,
	direction: Direction,
	width: number,
	height: number,
	isGhost = false,
): boolean => {
	const delta = DIRECTION_DELTAS[direction];
	const nextX = pos.x + delta.x;
	const nextY = pos.y + delta.y;

	if (nextX < 0 || nextX >= width) return true;
	if (nextY < 0 || nextY >= height) return false;

	const tile = getTileAt(grid, nextX, nextY);
	if (tile === null) return false;

	return isPassable(tile, isGhost);
};

export const getValidDirections = (
	grid: CellType[][],
	pos: Position,
	currentDir: Direction,
	width: number,
	height: number,
	isGhost = false,
): Direction[] => {
	const opposite = OPPOSITE_DIRECTIONS[currentDir];

	return ALL_DIRECTIONS.filter(
		(dir) => dir !== opposite && canMove(grid, pos, dir, width, height, isGhost),
	);
};

export const wrapPosition = (pos: Position, width: number): Position => {
	let wrappedX = pos.x;

	if (wrappedX < 0) wrappedX = width - 1;
	if (wrappedX >= width) wrappedX = 0;

	return { x: wrappedX, y: pos.y };
};

export const euclideanDistance = (pointA: Position, pointB: Position): number => {
	const deltaX = pointA.x - pointB.x;
	const deltaY = pointA.y - pointB.y;

	return Math.hypot(deltaX, deltaY);
};

export const getGhostTarget = (
	name: GhostName,
	ghostPos: Position,
	pacmanPos: Position,
	pacmanDir: Direction,
	blinkyPos: Position,
	scatterTarget: Position,
	mode: BoardEntity['currentGhostMode'],
): Position => {
	if (mode === 'scatter') return scatterTarget;

	const pacmanDelta = DIRECTION_DELTAS[pacmanDir];
	const TILES_AHEAD_PINKY = 4;
	const TILES_AHEAD_INKY = 2;
	const CLYDE_THRESHOLD = 8;

	switch (name) {
		case 'blinky':
			return pacmanPos;

		case 'pinky':
			return {
				x: pacmanPos.x + pacmanDelta.x * TILES_AHEAD_PINKY,
				y: pacmanPos.y + pacmanDelta.y * TILES_AHEAD_PINKY,
			};

		case 'inky': {
			const pivot = {
				x: pacmanPos.x + pacmanDelta.x * TILES_AHEAD_INKY,
				y: pacmanPos.y + pacmanDelta.y * TILES_AHEAD_INKY,
			};
			return {
				x: pivot.x + (pivot.x - blinkyPos.x),
				y: pivot.y + (pivot.y - blinkyPos.y),
			};
		}

		case 'clyde': {
			const distance = euclideanDistance(ghostPos, pacmanPos);
			return distance > CLYDE_THRESHOLD ? pacmanPos : scatterTarget;
		}
	}
};

export const chooseBestDirection = (
	validDirs: Direction[],
	pos: Position,
	target: Position,
	width: number,
): Direction => {
	if (validDirs.length === 0) return 'UP';
	if (validDirs.length === 1) return validDirs[0];

	let bestDir = validDirs[0];
	let bestDist = Infinity;

	for (const dir of validDirs) {
		const delta = DIRECTION_DELTAS[dir];
		const nextPos = wrapPosition({ x: pos.x + delta.x, y: pos.y + delta.y }, width);
		const dist = euclideanDistance(nextPos, target);

		if (dist < bestDist) {
			bestDist = dist;
			bestDir = dir;
		}
	}

	return bestDir;
};

export const createMazeGrid = (
	mazeData: number[][],
): { grid: CellType[][]; totalDots: number } => {
	let totalDots = 0;

	const grid = mazeData.map((row) =>
		row.map((cell) => {
			const cellType = CELL_TYPE_MAP[cell] ?? 'wall';

			if (cellType === 'dot' || cellType === 'power') {
				totalDots++;
			}

			return cellType;
		}),
	);

	return { grid, totalDots };
};

export const resetPositions = (entities: Entities): void => {
	const { pacman, blinky, pinky, inky, clyde } = entities;

	pacman.position = { ...PACMAN_START };
	pacman.direction = 'LEFT';
	pacman.nextDirection = null;

	const ghostEntities = { blinky, pinky, inky, clyde };

	for (const name of Object.keys(ghostEntities) as GhostName[]) {
		const ghost = ghostEntities[name];
		const config = GHOST_CONFIG[name];
		ghost.position = { ...config.startPosition };
		ghost.direction = config.startDirection;
		ghost.mode = name === 'blinky' ? 'scatter' : 'house';
	}

	entities.board.lastPacmanTick = 0;
	entities.board.lastGhostTick = 0;
	entities.board.frightenedTimer = 0;
	entities.board.ghostsEatenCombo = 0;
	entities.board.modeTimer = 0;
	entities.board.modePhaseIndex = 0;
	entities.board.currentGhostMode = 'scatter';
	entities.board.pendingActions = [];
};
