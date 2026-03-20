import { CELL_SIZE, GRID_COLS, GRID_ROWS } from '@/games/rge-brickfall-game/rge-brickfall-game.constants';
import type { Position } from '@/games/games.types';
import { SnakeRenderer } from '@/games/rge-snake-game/renderers/snake-renderer.component';
import { FoodRenderer } from '@/games/rge-snake-game/renderers/food-renderer.component';

const SNAKE_BODY: Position[] = [
	{ x: 6, y: 9 },
	{ x: 5, y: 9 },
	{ x: 4, y: 9 },
	{ x: 4, y: 10 },
	{ x: 4, y: 11 },
	{ x: 5, y: 11 },
];

const FOOD_POSITION: Position = { x: 8, y: 6 };

export const SnakePreview = () => (
	<div
		aria-hidden="true"
		style={{
			'--board-rows': GRID_ROWS,
			'--board-cols': GRID_COLS,
			'--board-cell-size': `${CELL_SIZE}px`,
			width: GRID_COLS * CELL_SIZE,
			height: GRID_ROWS * CELL_SIZE,
			position: 'relative',
			backgroundColor: 'var(--surface-alt)',
			border: '1px solid var(--border)',
			borderRadius: 'var(--radius-md)',
			overflow: 'hidden',
			backgroundImage: `linear-gradient(rgba(67, 217, 173, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(67, 217, 173, 0.06) 1px, transparent 1px)`,
			backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
			boxShadow: 'inset 1px 5px 11px 0 rgba(2, 18, 27, 0.71)',
			pointerEvents: 'none',
		}}
	>
		<SnakeRenderer body={SNAKE_BODY} cellSize={CELL_SIZE} />
		<FoodRenderer position={FOOD_POSITION} cellSize={CELL_SIZE} />
	</div>
);
