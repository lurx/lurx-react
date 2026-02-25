import type { ComponentType } from 'react';
import dynamic from 'next/dynamic';

const WolverineDemo = dynamic(() => import('@/demos/wolverine/wolverine.demo').then(mod => mod.WolverineDemo));
const SheepDemo = dynamic(() => import('@/demos/sheep/sheep.demo').then(mod => mod.SheepDemo));

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
			'A React adaptation of a Pure CSS art recreation of Wolverine character with advanced SCSS techniques and animations.',
		technologies: ['CSS', 'SCSS', 'React'],
		externalUrl: {
      origin: 'codepen.io',
      url: 'https://codepen.io/lurx/pen/rREBKM',
      iconName: 'codepen',
    },
		demo: WolverineDemo,
	},
	{
		id: 2,
		number: 2,
		slug: '_sheep-css',
		description:
			'A playful CSS art sheep inspired by Gregory Hartman\'s BAAAHHHHH Dribbble shot, built with pure SCSS animations.',
		technologies: ['CSS', 'SCSS', 'React'],
		externalUrl: {
			origin: 'codepen.io',
			url: 'https://codepen.io/lurx/pen/XGymgd',
			iconName: 'codepen',
		},
		demo: SheepDemo,
	},
] satisfies Project[];
