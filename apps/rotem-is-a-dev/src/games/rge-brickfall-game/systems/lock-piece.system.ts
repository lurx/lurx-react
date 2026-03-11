import { LINE_CLEAR_BLINK_MS, LINES_PER_LEVEL, SPAWN_POSITION, TETROMINO_COLORS } from '../rge-brickfall-game.constants';
import {
	calculateScore,
	clearFullLines,
	collides,
	getAbsoluteCells,
	getFullRowIndices,
	getGhostPosition,
	randomTetrominoType,
} from '../rge-brickfall-game.helpers';
import type { Entities, SystemArgs } from '../rge-brickfall-game.types';

const spawnNextPiece = (entities: Entities, dispatch: (event: { type: string }) => void): void => {
	const { activePiece, playfield, board, nextPiece, ghost } = entities;
	const { piece } = activePiece;

	const spawnType = nextPiece.type;
	const spawnCells = getAbsoluteCells(spawnType, SPAWN_POSITION, 0);

	if (collides(spawnCells, playfield.grid, board.width, board.height)) {
		dispatch({ type: 'game-over' });
		return;
	}

	piece.type = spawnType;
	piece.position = { ...SPAWN_POSITION };
	piece.rotation = 0;

	nextPiece.type = randomTetrominoType();
	board.softDropping = false;

	const ghostPosition = getGhostPosition(piece, playfield.grid, board.width, board.height);
	ghost.position = ghostPosition;
	ghost.type = piece.type;
	ghost.rotation = piece.rotation;
};

export const lockPiece = (entities: Entities, { events, dispatch, time }: SystemArgs): Entities => {
	const { playfield, board } = entities;

	if (playfield.clearingRows.length > 0) {
		if (time.current - board.clearingStartTime < LINE_CLEAR_BLINK_MS) {
			return entities;
		}

		const { grid: clearedGrid, linesCleared } = clearFullLines(playfield.grid, board.width);
		playfield.grid = clearedGrid;

		if (linesCleared > 0) {
			const points = calculateScore(linesCleared, board.level);
			board.score += points;
			board.linesCleared += linesCleared;
			board.level = Math.floor(board.linesCleared / LINES_PER_LEVEL) + 1;
			dispatch({ type: 'score-updated' });
		}

		playfield.clearingRows = [];
		spawnNextPiece(entities, dispatch);
		return entities;
	}

	const shouldLock = events.some(
		(event) => event.type === 'piece-landed' || event.type === 'lock-piece',
	);

	if (!shouldLock) return entities;

	const { activePiece } = entities;
	const { piece } = activePiece;
	const { grid } = playfield;

	const cells = getAbsoluteCells(piece.type, piece.position, piece.rotation);
	const color = TETROMINO_COLORS[piece.type];

	for (const cell of cells) {
		if (cell.y >= 0 && cell.y < board.height && cell.x >= 0 && cell.x < board.width) {
			grid[cell.y][cell.x] = color;
		}
	}

	const fullRows = getFullRowIndices(grid);

	if (fullRows.length > 0) {
		playfield.clearingRows = fullRows;
		board.clearingStartTime = time.current;
		piece.position = { x: -10, y: -10 };
		entities.ghost.position = { x: -10, y: -10 };
		return entities;
	}

	spawnNextPiece(entities, dispatch);
	return entities;
};
