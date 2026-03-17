import type { SystemArgs } from '../../games.types';
import type { Entities } from '../rge-pacman-game.types';

export const checkWinLose = (entities: Entities, { dispatch }: SystemArgs): Entities => {
	const { maze } = entities;

	if (maze.dotsRemaining === 0) {
		dispatch({ type: 'level-complete' });
	}

	return entities;
};
