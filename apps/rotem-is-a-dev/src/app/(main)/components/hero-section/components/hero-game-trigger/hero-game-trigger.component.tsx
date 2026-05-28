'use client';

import { FaIcon } from '@/app/components/fa-icon';
import { useHeroContext } from '../../hero.context';
import styles from './hero-game-trigger.module.scss';

const TRIGGER_LABEL = '> ./play snake.exe';

export const HeroGameTrigger = () => {
	const { openGame } = useHeroContext();

	return (
		<button
			type="button"
			className={styles.trigger}
			onClick={openGame}
			aria-label="Play the Snake game"
		>
			<span>{TRIGGER_LABEL}</span>
			<FaIcon iconName="play" iconGroup="fas" className={styles.icon} />
		</button>
	);
};
