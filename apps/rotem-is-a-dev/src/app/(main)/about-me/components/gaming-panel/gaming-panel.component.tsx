'use client';

import dynamic from 'next/dynamic';
import { useResponsive } from '@/hooks';
import type { GamingPanelProps } from './gaming-panel.types';
import styles from './gaming-panel.module.scss';

const RgeSnakeGame = dynamic(
	() => import('@/games/rge-snake-game').then((mod) => mod.RgeSnakeGame),
	{ ssr: false }
);

const RgeBrickfallGame = dynamic(
	() => import('@/games/rge-brickfall-game').then((mod) => mod.RgeBrickfallGame),
	{ ssr: false }
);

export const GamingPanel = ({ activeFileId }: GamingPanelProps) => {
	const { isMobile } = useResponsive();

	if (isMobile) return null;

	function renderGame() {
		if (activeFileId === 'brickfall-game') return <RgeBrickfallGame />;
		return <RgeSnakeGame />;
	}

	return (
		<div className={styles.panel}>
			{renderGame()}
		</div>
	);
};
