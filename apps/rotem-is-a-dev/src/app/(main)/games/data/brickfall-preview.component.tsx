import { CELL_SIZE, GRID_COLS, GRID_ROWS, TETROMINO_COLORS } from '@/games/rge-brickfall-game/rge-brickfall-game.constants';
import type { PlayfieldGrid, ActivePiece } from '@/games/rge-brickfall-game/rge-brickfall-game.types';
import { PlayfieldRenderer } from '@/games/rge-brickfall-game/renderers/playfield-renderer.component';
import { PieceRenderer } from '@/games/rge-brickfall-game/renderers/piece-renderer.component';

const PREVIEW_GRID: PlayfieldGrid = Array.from({ length: GRID_ROWS }, (_, rowIndex) => {
	if (rowIndex < 17) return Array.from<string | null>({ length: GRID_COLS }).fill(null);

	if (rowIndex === 17) {
		const row = Array.from<string | null>({ length: GRID_COLS }).fill(null);
		row[0] = TETROMINO_COLORS.L;
		row[1] = TETROMINO_COLORS.L;
		row[3] = TETROMINO_COLORS.S;
		row[4] = TETROMINO_COLORS.S;
		return row;
	}

	if (rowIndex === 18) {
		const row = Array.from<string | null>({ length: GRID_COLS }).fill(null);
		row[0] = TETROMINO_COLORS.L;
		row[2] = TETROMINO_COLORS.S;
		row[3] = TETROMINO_COLORS.S;
		row[5] = TETROMINO_COLORS.J;
		row[6] = TETROMINO_COLORS.J;
		row[7] = TETROMINO_COLORS.J;
		return row;
	}

	// Row 19 — bottom
	const row: (string | null)[] = [
		TETROMINO_COLORS.L,
		TETROMINO_COLORS.O,
		TETROMINO_COLORS.O,
		TETROMINO_COLORS.Z,
		TETROMINO_COLORS.Z,
		TETROMINO_COLORS.J,
		TETROMINO_COLORS.I,
		TETROMINO_COLORS.I,
		TETROMINO_COLORS.I,
		TETROMINO_COLORS.I,
	];
	return row;
});

const ACTIVE_PIECE: ActivePiece = {
	type: 'T',
	position: { x: 4, y: 14 },
	rotation: 0,
};

export const BrickfallPreview = () => (
	<div
		aria-hidden="true"
		style={{
			['--board-rows' as string]: GRID_ROWS,
			['--board-cols' as string]: GRID_COLS,
			['--board-cell-size' as string]: `${CELL_SIZE}px`,
			width: GRID_COLS * CELL_SIZE,
			height: GRID_ROWS * CELL_SIZE,
			position: 'relative',
			backgroundColor: 'var(--surface-alt)',
			border: '1px solid var(--border)',
			borderRadius: 'var(--radius-md)',
			overflow: 'hidden',
			backgroundImage: `linear-gradient(rgba(199, 146, 234, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(199, 146, 234, 0.06) 1px, transparent 1px)`,
			backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
			boxShadow: 'inset 1px 5px 11px 0 rgba(2, 18, 27, 0.71)',
			pointerEvents: 'none',
		}}
	>
		<PlayfieldRenderer grid={PREVIEW_GRID} cellSize={CELL_SIZE} />
		<PieceRenderer piece={ACTIVE_PIECE} cellSize={CELL_SIZE} />
	</div>
);
