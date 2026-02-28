'use client';

import { type ChangeEvent, useCallback, useState, type ComponentType } from 'react';
import type { Project } from '../../data/projects.data';
import { ALL_TECHNOLOGIES, PROJECTS } from '../../data/projects.data';
import { FilterPanel, TextInput, TechnologyFilter } from '@/app/components';
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

	const handleSearchChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setSearch(event.target.value);
		},
		[],
	);

	const toggleTechnology = useCallback((tech: string) => {
		const value = tech as Technology;
		setSelectedTechnologies(prev =>
			prev.includes(value)
				? prev.filter(item => item !== value)
				: [...prev, value],
		);
	}, []);

	const handleViewProject = useCallback((project: Project) => {
		setSelectedProject(project);
	}, []);

	const handleCloseDrawer = useCallback(() => {
		setSelectedProject(null);
	}, []);

	const searchLower = search.toLowerCase();

	const filteredProjects = PROJECTS.filter(project => {
		const matchesTech =
			selectedTechnologies.length === 0 ||
			project.technologies.some(tech =>
				selectedTechnologies.includes(tech),
			);
		const matchesSearch =
			!search ||
			project.slug.toLowerCase().includes(searchLower) ||
			project.description.toLowerCase().includes(searchLower);
		return matchesTech && matchesSearch;
	});

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
				/>
			</div>

			<ProjectDemoDrawer
				project={selectedProject}
				onClose={handleCloseDrawer}
			>
				<DemoRenderer demo={DemoComponent} />
			</ProjectDemoDrawer>
		</div>
	);
};
