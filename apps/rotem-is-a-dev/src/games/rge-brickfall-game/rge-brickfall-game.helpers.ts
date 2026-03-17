import {
	ALL_TETROMINO_TYPES,
	BASE_TICK_MS,
	LINE_SCORES,
	MIN_TICK_MS,
	TETROMINO_SHAPES,
	TICK_REDUCTION_PER_LEVEL,
} from './rge-brickfall-game.constants';
import type { Position } from '../games.types';
import type { CellColor, PlayfieldGrid, RotationState, TetrominoType } from './rge-brickfall-game.types';

export const getAbsoluteCells = (
	type: TetrominoType,
	position: Position,
	rotation: RotationState,
): Position[] =>
	TETROMINO_SHAPES[type][rotation].map((cell) => ({
		x: cell.x + position.x,
		y: cell.y + position.y,
	}));

export const getNextRotation = (current: RotationState): RotationState =>
	((current + 1) % 4) as RotationState;

export const collides = (
	cells: Position[],
	grid: PlayfieldGrid,
	cols: number,
	rows: number,
): boolean =>
	cells.some(
		(cell) =>
			cell.x < 0 ||
			cell.x >= cols ||
			cell.y >= rows ||
			(cell.y >= 0 && grid[cell.y][cell.x] !== null),
	);

export const getGhostPosition = (
	piece: { type: TetrominoType; position: Position; rotation: RotationState },
	grid: PlayfieldGrid,
	cols: number,
	rows: number,
): Position => {
	let ghostY = piece.position.y;

	while (true) {
		const nextY = ghostY + 1;
		const cells = getAbsoluteCells(piece.type, { x: piece.position.x, y: nextY }, piece.rotation);

		if (collides(cells, grid, cols, rows)) break;
		ghostY = nextY;
	}

	return { x: piece.position.x, y: ghostY };
};

export const createEmptyGrid = (rows: number, cols: number): PlayfieldGrid =>
	Array.from({ length: rows }, () => Array.from<CellColor>({ length: cols }).fill(null));

export const getTickMsForLevel = (level: number): number =>
	Math.max(BASE_TICK_MS - (level - 1) * TICK_REDUCTION_PER_LEVEL, MIN_TICK_MS);

export const randomTetrominoType = (): TetrominoType =>
	ALL_TETROMINO_TYPES[Math.floor(Math.random() * ALL_TETROMINO_TYPES.length)];

export const clearFullLines = (
	grid: PlayfieldGrid,
	cols: number,
): { grid: PlayfieldGrid; linesCleared: number } => {
	const remaining = grid.filter((row) => row.includes(null));
	const linesCleared = grid.length - remaining.length;

	if (linesCleared === 0) return { grid, linesCleared: 0 };

	const emptyRows = Array.from({ length: linesCleared }, () =>
		Array.from<CellColor>({ length: cols }).fill(null),
	);

	return { grid: [...emptyRows, ...remaining], linesCleared };
};

export const calculateScore = (linesCleared: number, level: number): number => {
	if (linesCleared === 0) return 0;
	return (LINE_SCORES[linesCleared] ?? 0) * level;
};

export const getFullRowIndices = (grid: PlayfieldGrid): number[] =>
	grid.reduce<number[]>((indices, row, index) => {
		if (row.every((cell) => cell !== null)) {
			indices.push(index);
		}
		return indices;
	}, []);
