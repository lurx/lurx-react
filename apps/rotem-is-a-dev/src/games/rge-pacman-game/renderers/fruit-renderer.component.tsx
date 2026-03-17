import { FRUIT_CONFIG } from '../rge-pacman-game.constants';
import type { FruitRendererProps } from '../rge-pacman-game.types';
import styles from '../rge-pacman-game.module.scss';

export const FruitRenderer = ({
	position,
	active,
	fruitType,
	cellSize,
}: FruitRendererProps) => {
	if (!active) return null;

	return (
		<div
			data-testid="fruit"
			className={styles.fruit}
			style={{
				left: position.x * cellSize,
				top: position.y * cellSize,
			}}
		>
			{FRUIT_CONFIG[fruitType].emoji}
		</div>
	);
};
