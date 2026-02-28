import type { Metadata } from 'next';
import { ProjectsPage } from './components';

export const metadata: Metadata = {
	title: 'Projects',
	description:
		'Explore projects and open-source work by Rotem Horovitz, showcasing modern frontend development with React and TypeScript.',
};

export default function ProjectsRoute() {
	return <ProjectsPage />;
}
