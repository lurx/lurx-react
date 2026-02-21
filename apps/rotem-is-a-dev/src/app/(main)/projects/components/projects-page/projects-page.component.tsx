'use client';

import { useState } from 'react';
import { ALL_TECHNOLOGIES, PROJECTS } from '../../data/projects.data';
import type { Technology } from '../../data/projects.data';
import { TechnologyFilter } from '../technology-filter/technology-filter.component';
import { ProjectsGrid } from '../projects-grid/projects-grid.component';
import styles from './projects-page.module.scss';

export const ProjectsPage = () => {
	const [selectedTechnologies, setSelectedTechnologies] = useState<
		Technology[]
	>([]);

	const toggleTechnology = (tech: Technology) => {
		setSelectedTechnologies(prev =>
			prev.includes(tech) ? prev.filter(item => item !== tech) : [...prev, tech],
		);
	};

	const filteredProjects =
		selectedTechnologies.length === 0
			? PROJECTS
			: PROJECTS.filter(project =>
					project.technologies.some(tech =>
						selectedTechnologies.includes(tech),
					),
			  );

	return (
		<div className={styles.page}>
			<div
				className={styles.filterPanel}
				role="navigation"
				aria-label="Filter projects by technology"
			>
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
				/>
			</div>
		</div>
	);
};
