import { WolverineDemo } from '@/demos';
import type { ComponentType } from 'react';

export type Technology =
	| 'React'
	| 'TypeScript'
	| 'HTML'
	| 'CSS'
	| 'SCSS';

  interface ProjectExternalUrl {
    origin: string;
    url: string;
    iconName?: string; // Optional, can be used to determine which icon to show
  }

export interface Project {
	id: number;
	number: number;
	slug: string;
	description: string;
	technologies: Technology[];
  externalUrl?: ProjectExternalUrl;
	demo?: ComponentType;
}

export const ALL_TECHNOLOGIES: Technology[] = [
	'React',
	'TypeScript',
	'HTML',
	'CSS',
	'SCSS',
];

export const PROJECTS = [
	{
		id: 1,
		number: 1,
		slug: '_wolverine-css',
		description:
			'Pure CSS art recreation of Wolverine character with advanced SCSS techniques and animations.',
		technologies: ['CSS', 'SCSS', 'React', 'TypeScript'],
		externalUrl: {
      origin: 'codepen.io',
      url: 'https://codepen.io/lurx/pen/rREBKM',
      iconName: 'codepen',
    },
		demo: WolverineDemo,
	},
] satisfies Project[];
