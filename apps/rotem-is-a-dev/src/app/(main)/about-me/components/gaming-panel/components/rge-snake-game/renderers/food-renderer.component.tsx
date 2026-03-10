import { COLORS } from '../rge-snake-game.constants';
import type { Position } from '../rge-snake-game.types';
import styles from '../rge-snake-game.module.scss';

export const FoodRenderer = ({ position, cellSize }: { position: Position; cellSize: number }) => (
	<div
		data-testid="food"
		className={styles.food}
		style={{
			position: 'absolute',
			left: position.x * cellSize,
			top: position.y * cellSize,
			width: cellSize,
			height: cellSize,
			backgroundColor: COLORS.food,
			borderRadius: '50%',
			boxShadow: `0 0 10px ${COLORS.foodGlow}`,
		}}
	/>
);
