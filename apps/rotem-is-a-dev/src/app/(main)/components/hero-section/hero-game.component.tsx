'use client';

import { SnakeGame } from '../snake-game/snake-game.component';
import { useHeroContext } from './hero.context';

export const HeroGame = () => {
	const { gameCompleted, handleComplete } = useHeroContext();

	if (gameCompleted) return null;

	return (
		<SnakeGame
			onWin={handleComplete}
			onSkip={handleComplete}
		/>
	);
};
