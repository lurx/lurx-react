export type Technology =
	| 'React'
	| 'TypeScript'
	| 'HTML'
	| 'CSS';

export interface Project {
	id: number;
	number: number;
	slug: string;
	description: string;
	technologies: Technology[];
	liveUrl?: string;
}

export const ALL_TECHNOLOGIES: Technology[] = [
	'React',
	'TypeScript',
	'HTML',
	'CSS',
];

export const PROJECTS: Project[] = [
	{
		id: 1,
		number: 1,
		slug: '_ui-animations',
		description:
			'Interactive UI animations built with AnimeJS and React for a modern portfolio experience.',
		technologies: ['React', 'TypeScript'],
		liveUrl: '#',
	},
	{
		id: 2,
		number: 2,
		slug: '_tetris-game',
		description:
			'A fully-playable Tetris game built with pure React hooks and a custom game loop engine.',
		technologies: ['React', 'TypeScript'],
		liveUrl: '#',
	},
	{
		id: 3,
		number: 3,
		slug: '_design-system',
		description:
			'Vanguardis — a component library and design system built with React and SCSS modules.',
		technologies: ['React', 'TypeScript'],
		liveUrl: '#',
	},
	{
		id: 4,
		number: 4,
		slug: '_portfolio-v1',
		description:
			'First iteration of my personal portfolio built with plain HTML, CSS, and vanilla JS.',
		technologies: ['HTML', 'CSS'],
		liveUrl: '#',
	},
];
