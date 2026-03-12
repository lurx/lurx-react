import { COLORS } from '../rge-snake-game.constants';
import type { Position } from '../rge-snake-game.types';

export const SnakeRenderer = ({ body, cellSize }: { body: Position[]; cellSize: number }) => (
	<>
		{body.map((segment, index) => {
			const isHead = index === 0;
			const opacity = 1 - (index / body.length) * 0.5;

			return (
				<div
					key={`snake-${index}-${segment.x}-${segment.y}`}
					data-testid={isHead ? 'snake-head' : 'snake-segment'}
					style={{
						position: 'absolute',
						left: segment.x * cellSize,
						top: segment.y * cellSize,
						width: cellSize,
						height: cellSize,
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
