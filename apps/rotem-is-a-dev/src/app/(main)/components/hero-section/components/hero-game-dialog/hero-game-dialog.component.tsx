'use client';

import { Dialog } from '@/app/components';
import { HeroGame } from '../../hero-game.component';
import { useHeroContext } from '../../hero.context';
import styles from './hero-game-dialog.module.scss';

export const HeroGameDialog = () => {
	const { isGameOpen, closeGame } = useHeroContext();

	return (
		<Dialog
			isOpen={isGameOpen}
			onCloseAction={closeGame}
			ariaLabel="Snake game"
			className={styles.dialog}
		>
			<HeroGame />
		</Dialog>
	);
};
