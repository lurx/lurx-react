'use client';

import { useCallback, useState } from 'react';
import type { Project, Technology } from '../../data/projects.data';
import { ALL_TECHNOLOGIES, PROJECTS } from '../../data/projects.data';
import { ProjectDemoDrawer } from '../project-demo-drawer/project-demo-drawer.component';
import { ProjectsGrid } from '../projects-grid/projects-grid.component';
import { TechnologyFilter } from '../technology-filter/technology-filter.component';
import styles from './projects-page.module.scss';

export const ProjectsPage = () => {
	const [selectedTechnologies, setSelectedTechnologies] = useState<
		Technology[]
	>([]);
	const [selectedProject, setSelectedProject] = useState<Nullable<Project>>(null);

	const toggleTechnology = (tech: Technology) => {
		setSelectedTechnologies(prev =>
			prev.includes(tech) ? prev.filter(item => item !== tech) : [...prev, tech],
		);
	};

	const handleViewProject = useCallback((project: Project) => {
		setSelectedProject(project);
	}, []);

	const handleCloseDrawer = useCallback(() => {
		setSelectedProject(null);
	}, []);

	const filteredProjects =
		selectedTechnologies.length === 0
			? PROJECTS
			: PROJECTS.filter(project =>
					project.technologies.some(tech =>
						selectedTechnologies.includes(tech),
					),
			  );

	const DemoComponent = selectedProject?.demo;

	return (
		<div className={styles.page}>
			<div className={styles.filterPanel}>
				<TechnologyFilter
					technologies={ALL_TECHNOLOGIES}
					selected={selectedTechnologies}
					onToggle={toggleTechnology}
				/>
			</div>

			<div className={styles.content}>
				<ProjectsGrid
					projects={filteredProjects}
					activeFilters={selectedTechnologies}
					onRemoveFilter={toggleTechnology}
					onViewProject={handleViewProject}
				/>
			</div>

			<ProjectDemoDrawer
				project={selectedProject}
				onClose={handleCloseDrawer}
			>
				{DemoComponent && <DemoComponent />}
			</ProjectDemoDrawer>
		</div>
	);
};
