'use client';

import { useResponsive } from '@/hooks';
import { SnakeGame } from '@/app/(main)/components/snake-game';
import { noop } from 'es-toolkit';
import styles from './gaming-panel.module.scss';

export const GamingPanel = () => {
	const { isMobile } = useResponsive();

	if (isMobile) return null;

	return (
		<div className={styles.panel}>
			<SnakeGame onWin={noop} onSkip={noop} />
		</div>
	);
};
