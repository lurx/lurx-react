export type Technology =
	| 'React'
	| 'TypeScript'
	| 'HTML'
	| 'CSS'
	| 'SCSS';

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
	'SCSS',
];

export const PROJECTS: Project[] = [
	{
		id: 1,
		number: 1,
		slug: '_wolverine-css',
		description:
			'Pure CSS art recreation of Wolverine character with advanced SCSS techniques and animations.',
		technologies: ['CSS', 'SCSS', 'React', 'TypeScript'],
		liveUrl: '/demo/wolverine-css',
	},
];
