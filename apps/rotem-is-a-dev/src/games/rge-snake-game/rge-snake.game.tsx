import 'regenerator-runtime/runtime';
import { RgeSnakeGame as RgeSnakeGameImpl } from './rge-snake-game.component';
import type { RgeSnakeGameProps } from './rge-snake-game.component';

export const RgeSnakeGame = (props: RgeSnakeGameProps) => {
	return <RgeSnakeGameImpl {...props} />;
};
