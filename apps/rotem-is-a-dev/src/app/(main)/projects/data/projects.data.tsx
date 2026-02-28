import { AnimatedLoader } from '@/app/components';
import dynamic from 'next/dynamic';
import type { Project } from './projects.types';

export type { Project, ProjectExternalUrl } from './projects.types';

const loading = () => <AnimatedLoader />;

const WolverineDemo = dynamic(
	() =>
		import('@/demos/wolverine/wolverine.demo').then(mod => mod.WolverineDemo),
	{ loading },
);
const SheepDemo = dynamic(
	() => import('@/demos/sheep/sheep.demo').then(mod => mod.SheepDemo),
	{ loading },
);

export const ALL_TECHNOLOGIES: Technology[] = [
	'react',
	'typescript',
	'html',
	'css',
	'scss',
	'svg',
];

export const PROJECTS = [
	{
		id: 1,
		number: 1,
		slug: '_wolverine-css',
		description:
			'A React adaptation of a Pure CSS art recreation of Wolverine character with advanced SCSS techniques and animations.',
		technologies: ['css', 'scss', 'react'],
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
			"A playful CSS art sheep inspired by Gregory Hartman's BAAAHHHHH Dribbble shot, built with pure SCSS animations.",
		technologies: ['css', 'scss', 'react'],
		externalUrl: {
			origin: 'codepen.io',
			url: 'https://codepen.io/lurx/pen/XGymgd',
			iconName: 'codepen',
		},
		demo: SheepDemo,
	},
	{
		id: 3,
		number: 3,
		slug: '_animated-logo-loader',
		description:
			'The animated loader for this site, featuring a tracing css-driven animated version of the logo.',
		technologies: ['css', 'scss', 'react', 'svg'],
		demo: AnimatedLoader,
	},
] satisfies Project[];
