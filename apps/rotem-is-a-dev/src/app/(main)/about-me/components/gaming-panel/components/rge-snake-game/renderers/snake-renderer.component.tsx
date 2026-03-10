import { CELL_SIZE, COLORS } from '../rge-snake-game.constants';
import type { Position } from '../rge-snake-game.types';

export const SnakeRenderer = ({ body }: { body: Position[] }) => (
	<>
		{body.map((segment, index) => {
			const isHead = index === 0;
			const opacity = 1 - (index / body.length) * 0.5;

			return (
				<div
					key={`snake-${index}`}
					data-testid={isHead ? 'snake-head' : 'snake-segment'}
					style={{
						position: 'absolute',
						left: segment.x * CELL_SIZE,
						top: segment.y * CELL_SIZE,
						width: CELL_SIZE,
						height: CELL_SIZE,
						backgroundColor: COLORS.snake,
						opacity,
						borderRadius: isHead ? 4 : 2,
						boxShadow: isHead ? `0 0 8px ${COLORS.snakeGlow}` : 'none',
					}}
				/>
			);
		})}
	</>
);
