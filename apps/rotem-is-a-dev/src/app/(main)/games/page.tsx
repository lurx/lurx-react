import type { Metadata } from 'next';
import { GamesPage } from './components';

export const metadata: Metadata = {
	title: 'Games',
	description:
		'Play classic browser games built with a custom React Game Engine — Snake, Brickfall, and more.',
};

export default function GamesRoute() {
	return <GamesPage />;
}
