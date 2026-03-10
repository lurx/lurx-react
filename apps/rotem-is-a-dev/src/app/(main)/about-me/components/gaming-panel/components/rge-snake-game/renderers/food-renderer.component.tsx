import { CELL_SIZE, COLORS } from '../rge-snake-game.constants';
import type { Position } from '../rge-snake-game.types';
import styles from '../rge-snake-game.module.scss';

export const FoodRenderer = ({ position }: { position: Position }) => (
	<div
		data-testid="food"
		className={styles.food}
		style={{
			position: 'absolute',
			left: position.x * CELL_SIZE,
			top: position.y * CELL_SIZE,
			width: CELL_SIZE,
			height: CELL_SIZE,
			backgroundColor: COLORS.food,
			borderRadius: '50%',
			boxShadow: `0 0 10px ${COLORS.foodGlow}`,
		}}
	/>
);
