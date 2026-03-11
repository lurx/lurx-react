import {
	calculateScore,
	clearFullLines,
	collides,
	createEmptyGrid,
	getAbsoluteCells,
	getFullRowIndices,
	getGhostPosition,
	getNextRotation,
	getTickMsForLevel,
	randomTetrominoType,
} from '../rge-brickfall-game.helpers';
import { ALL_TETROMINO_TYPES } from '../rge-brickfall-game.constants';
import type { PlayfieldGrid } from '../rge-brickfall-game.types';

describe('getAbsoluteCells', () => {
	it('returns absolute positions for a T piece at origin', () => {
		const cells = getAbsoluteCells('T', { x: 0, y: 0 }, 0);
		expect(cells).toEqual([
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
		]);
	});

	it('offsets cells by piece position', () => {
		const cells = getAbsoluteCells('T', { x: 3, y: 2 }, 0);
		expect(cells).toEqual([
			{ x: 4, y: 2 },
			{ x: 3, y: 3 },
			{ x: 4, y: 3 },
			{ x: 5, y: 3 },
		]);
	});

	it('returns correct cells for I piece rotation 1', () => {
		const cells = getAbsoluteCells('I', { x: 0, y: 0 }, 1);
		expect(cells).toEqual([
			{ x: 2, y: 0 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 2, y: 3 },
		]);
	});

	it('returns correct cells for O piece (all rotations identical)', () => {
		const cells0 = getAbsoluteCells('O', { x: 0, y: 0 }, 0);
		const cells1 = getAbsoluteCells('O', { x: 0, y: 0 }, 1);
		expect(cells0).toEqual(cells1);
	});
});

describe('getNextRotation', () => {
	it('increments rotation from 0 to 1', () => {
		expect(getNextRotation(0)).toBe(1);
	});

	it('increments rotation from 1 to 2', () => {
		expect(getNextRotation(1)).toBe(2);
	});

	it('increments rotation from 2 to 3', () => {
		expect(getNextRotation(2)).toBe(3);
	});

	it('wraps rotation from 3 to 0', () => {
		expect(getNextRotation(3)).toBe(0);
	});
});

describe('collides', () => {
	const emptyGrid = createEmptyGrid(20, 10);

	it('returns false when cells are within bounds and grid is empty', () => {
		const cells = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
		expect(collides(cells, emptyGrid, 10, 20)).toBe(false);
	});

	it('returns true when a cell is to the left of the grid', () => {
		const cells = [{ x: -1, y: 0 }];
		expect(collides(cells, emptyGrid, 10, 20)).toBe(true);
	});

	it('returns true when a cell is to the right of the grid', () => {
		const cells = [{ x: 10, y: 0 }];
		expect(collides(cells, emptyGrid, 10, 20)).toBe(true);
	});

	it('returns true when a cell is below the grid', () => {
		const cells = [{ x: 0, y: 20 }];
		expect(collides(cells, emptyGrid, 10, 20)).toBe(true);
	});

	it('allows cells above the grid (negative y)', () => {
		const cells = [{ x: 0, y: -1 }];
		expect(collides(cells, emptyGrid, 10, 20)).toBe(false);
	});

	it('returns true when a cell overlaps an occupied grid cell', () => {
		const grid = createEmptyGrid(20, 10);
		grid[5][3] = '#ff0000';
		const cells = [{ x: 3, y: 5 }];
		expect(collides(cells, grid, 10, 20)).toBe(true);
	});
});

describe('getGhostPosition', () => {
	it('drops piece to the bottom of an empty grid', () => {
		const grid = createEmptyGrid(20, 10);
		const piece = { type: 'T' as const, position: { x: 3, y: 0 }, rotation: 0 as const };
		const ghost = getGhostPosition(piece, grid, 10, 20);
		expect(ghost.y).toBe(18);
		expect(ghost.x).toBe(3);
	});

	it('stops above an occupied row', () => {
		const grid = createEmptyGrid(20, 10);
		for (let col = 0; col < 10; col++) {
			grid[19][col] = '#ff0000';
		}
		const piece = { type: 'T' as const, position: { x: 3, y: 0 }, rotation: 0 as const };
		const ghost = getGhostPosition(piece, grid, 10, 20);
		expect(ghost.y).toBe(17);
	});

	it('returns the same position if piece cannot move down', () => {
		const grid = createEmptyGrid(20, 10);
		for (let col = 0; col < 10; col++) {
			grid[1][col] = '#ff0000';
		}
		const piece = { type: 'T' as const, position: { x: 3, y: 0 }, rotation: 0 as const };
		const ghost = getGhostPosition(piece, grid, 10, 20);
		expect(ghost.y).toBe(0);
	});
});

describe('createEmptyGrid', () => {
	it('creates a grid with the correct dimensions', () => {
		const grid = createEmptyGrid(20, 10);
		expect(grid).toHaveLength(20);
		expect(grid[0]).toHaveLength(10);
	});

	it('fills the grid with null values', () => {
		const grid = createEmptyGrid(5, 3);
		for (const row of grid) {
			for (const cell of row) {
				expect(cell).toBeNull();
			}
		}
	});

	it('creates independent rows', () => {
		const grid = createEmptyGrid(3, 3);
		grid[0][0] = '#ff0000';
		expect(grid[1][0]).toBeNull();
	});
});

describe('getTickMsForLevel', () => {
	it('returns BASE_TICK_MS for level 1', () => {
		expect(getTickMsForLevel(1)).toBe(800);
	});

	it('reduces tick by 60ms per level', () => {
		expect(getTickMsForLevel(2)).toBe(740);
		expect(getTickMsForLevel(3)).toBe(680);
	});

	it('clamps to MIN_TICK_MS', () => {
		expect(getTickMsForLevel(100)).toBe(100);
	});

	it('returns 100 at the boundary level', () => {
		expect(getTickMsForLevel(13)).toBe(100);
	});
});

describe('randomTetrominoType', () => {
	it('returns a valid tetromino type', () => {
		const result = randomTetrominoType();
		expect(ALL_TETROMINO_TYPES).toContain(result);
	});

	it('returns different types over many calls', () => {
		const results = new Set<string>();
		for (let index = 0; index < 100; index++) {
			results.add(randomTetrominoType());
		}
		expect(results.size).toBeGreaterThan(1);
	});
});

describe('clearFullLines', () => {
	it('returns the same grid when no lines are full', () => {
		const grid = createEmptyGrid(20, 10);
		const result = clearFullLines(grid, 10);
		expect(result.linesCleared).toBe(0);
		expect(result.grid).toBe(grid);
	});

	it('clears one full line', () => {
		const grid = createEmptyGrid(4, 3);
		grid[3] = ['#ff0000', '#ff0000', '#ff0000'];
		const result = clearFullLines(grid, 3);
		expect(result.linesCleared).toBe(1);
		expect(result.grid).toHaveLength(4);
		expect(result.grid[0].every((cell) => cell === null)).toBe(true);
	});

	it('clears multiple full lines', () => {
		const grid = createEmptyGrid(4, 3);
		grid[2] = ['#ff0000', '#ff0000', '#ff0000'];
		grid[3] = ['#00ff00', '#00ff00', '#00ff00'];
		const result = clearFullLines(grid, 3);
		expect(result.linesCleared).toBe(2);
		expect(result.grid).toHaveLength(4);
		expect(result.grid[0].every((cell) => cell === null)).toBe(true);
		expect(result.grid[1].every((cell) => cell === null)).toBe(true);
	});

	it('preserves non-full lines below cleared lines', () => {
		const grid = createEmptyGrid(4, 3);
		grid[1][0] = '#0000ff';
		grid[2] = ['#ff0000', '#ff0000', '#ff0000'];
		const result = clearFullLines(grid, 3);
		expect(result.linesCleared).toBe(1);
		expect(result.grid[2][0]).toBe('#0000ff');
	});
});

describe('calculateScore', () => {
	it('returns 0 for 0 lines cleared', () => {
		expect(calculateScore(0, 1)).toBe(0);
	});

	it('returns 100 for 1 line at level 1', () => {
		expect(calculateScore(1, 1)).toBe(100);
	});

	it('returns 300 for 2 lines at level 1', () => {
		expect(calculateScore(2, 1)).toBe(300);
	});

	it('returns 500 for 3 lines at level 1', () => {
		expect(calculateScore(3, 1)).toBe(500);
	});

	it('returns 800 for 4 lines at level 1', () => {
		expect(calculateScore(4, 1)).toBe(800);
	});

	it('multiplies score by level', () => {
		expect(calculateScore(1, 5)).toBe(500);
		expect(calculateScore(4, 3)).toBe(2400);
	});

	it('returns 0 for unrecognized line count', () => {
		expect(calculateScore(5, 1)).toBe(0);
	});
});

describe('getFullRowIndices', () => {
	it('returns empty array for empty grid', () => {
		const grid = createEmptyGrid(4, 3);
		expect(getFullRowIndices(grid)).toEqual([]);
	});

	it('returns index of a single full row', () => {
		const grid = createEmptyGrid(4, 3);
		grid[3] = ['#ff0000', '#ff0000', '#ff0000'];
		expect(getFullRowIndices(grid)).toEqual([3]);
	});

	it('returns indices of multiple full rows', () => {
		const grid = createEmptyGrid(4, 3);
		grid[1] = ['#ff0000', '#ff0000', '#ff0000'];
		grid[3] = ['#00ff00', '#00ff00', '#00ff00'];
		expect(getFullRowIndices(grid)).toEqual([1, 3]);
	});

	it('does not include partially filled rows', () => {
		const grid = createEmptyGrid(4, 3);
		grid[2][0] = '#ff0000';
		grid[2][1] = '#ff0000';
		grid[3] = ['#ff0000', '#ff0000', '#ff0000'];
		expect(getFullRowIndices(grid)).toEqual([3]);
	});
});
