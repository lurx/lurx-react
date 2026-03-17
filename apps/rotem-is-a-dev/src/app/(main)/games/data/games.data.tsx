import { AnimatedLoader } from '@/app/components';
import dynamic from 'next/dynamic';
import { BrickfallPreview } from './brickfall-preview.component';
import { PacmanPreview } from './pacman-preview.component';
import { SnakePreview } from './snake-preview.component';
import type { Game } from './games.types';

export type { Game } from './games.types';

const loading = () => <AnimatedLoader />;

const RgeSnakeGame = dynamic(
	() => import('@/games/rge-snake-game').then(mod => mod.RgeSnakeGame),
	{ ssr: false, loading },
);

const RgeBrickfallGame = dynamic(
	() => import('@/games/rge-brickfall-game').then(mod => mod.RgeBrickfallGame),
	{ ssr: false, loading },
);

const RgePacmanGame = dynamic(
	() => import('@/games/rge-pacman-game').then(mod => mod.RgePacmanGame),
	{ ssr: false, loading },
);

export const GAMES: Game[] = [
	{
		id: 1,
		number: 1,
		slug: '_snake',
		description:
			'Classic snake game. Guide the snake, eat food dots, avoid walls and your own tail.',
		preview: SnakePreview,
		game: RgeSnakeGame,
	},
	{
		id: 2,
		number: 2,
		slug: '_brickfall',
		description:
			'Tetris-inspired brick game. Rotate and place falling tetrominoes to clear lines.',
		preview: BrickfallPreview,
		game: RgeBrickfallGame,
	},
	{
		id: 3,
		number: 3,
		slug: '_pacman',
		description:
			'Pac-Man arcade game. Navigate the maze, eat dots, avoid ghosts, and use power pellets.',
		preview: PacmanPreview,
		game: RgePacmanGame,
	},
];
