'use client';

import dynamic from 'next/dynamic';
import { useResponsive } from '@/hooks';
import styles from './gaming-panel.module.scss';

const RgeSnakeGame = dynamic(
	() => import('regenerator-runtime/runtime').then(() =>
		import('./components/rge-snake-game').then((mod) => mod.RgeSnakeGame)
	),
	{ ssr: false }
);

export const GamingPanel = () => {
	const { isMobile } = useResponsive();

	if (isMobile) return null;

	return (
		<div className={styles.panel}>
			<RgeSnakeGame />
		</div>
	);
};
