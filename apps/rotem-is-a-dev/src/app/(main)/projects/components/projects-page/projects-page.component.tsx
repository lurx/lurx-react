'use client';

import { FilterPanel, TextInput, TechnologyFilter } from '@/app/components';
import { toggleInArray } from '@/app/utils/toggle-in-array.util';
import { type ChangeEvent, useCallback, useState, type ComponentType } from 'react';
import type { Project } from '../../data/projects.data';
import { ALL_TECHNOLOGIES, PROJECTS } from '../../data/projects.data';
import { filterProjects } from './projects-page.helpers';
import { DemoRenderer } from '../demo-renderer';
import { ProjectDemoDrawer } from '../project-demo-drawer';
import { ProjectsGrid } from '../projects-grid';
import styles from './projects-page.module.scss';

export const ProjectsPage = () => {
	const [search, setSearch] = useState('');
	const [selectedTechnologies, setSelectedTechnologies] = useState<
		Technology[]
	>([]);
	const [selectedProject, setSelectedProject] =
		useState<Nullable<Project>>(null);
	const [scrollToComments, setScrollToComments] = useState(false);

	const handleSearchChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setSearch(event.target.value);
		},
		[],
	);

	const toggleTechnology = useCallback((tech: string) => {
		setSelectedTechnologies(prev => toggleInArray(prev, tech as Technology));
	}, []);

	const handleViewProject = useCallback((project: Project) => {
		setSelectedProject(project);
		setScrollToComments(false);
	}, []);

	const handleCommentClick = useCallback((project: Project) => {
		setSelectedProject(project);
		setScrollToComments(true);
	}, []);

	const handleCloseDrawer = useCallback(() => {
		setSelectedProject(null);
		setScrollToComments(false);
	}, []);

	const filteredProjects = filterProjects(PROJECTS, selectedTechnologies, search);

	const DemoComponent: Nullable<ComponentType> = selectedProject?.demo ?? null;

	return (
		<div className={styles.page}>
			<FilterPanel>
				<TextInput
					label="_search:"
					value={search}
					onChange={handleSearchChange}
					placeholder="Search projects..."
				/>
				<TechnologyFilter
					technologies={ALL_TECHNOLOGIES}
					selected={selectedTechnologies}
					onToggle={toggleTechnology}
				/>
			</FilterPanel>

			<div className={styles.content}>
				<ProjectsGrid
					projects={filteredProjects}
					onViewProject={handleViewProject}
					onCommentClick={handleCommentClick}
				/>
			</div>

			<ProjectDemoDrawer
				project={selectedProject}
				onClose={handleCloseDrawer}
				scrollToComments={scrollToComments}
			>
				<DemoRenderer demo={DemoComponent} />
			</ProjectDemoDrawer>
		</div>
	);
};
