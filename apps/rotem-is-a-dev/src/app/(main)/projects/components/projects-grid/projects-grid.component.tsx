import { FaIcon } from '@/app/components/fa-icon/fa-icon.component';
import type { Project, Technology } from '../../data/projects.data';
import { ProjectCard } from '../project-card/project-card.component';
import styles from './projects-grid.module.scss';

interface ProjectsGridProps {
	projects: Project[];
	activeFilters: Technology[];
	onRemoveFilter: (tech: Technology) => void;
}

export const ProjectsGrid = ({
	projects,
	activeFilters,
	onRemoveFilter,
}: ProjectsGridProps) => {
	return (
		<div className={styles.container}>
			{activeFilters.length > 0 && (
				<div
					className={styles.tabBar}
					role="tablist"
				>
					{activeFilters.map(tech => (
						<div
							key={tech}
							className={styles.tab}
							role="tab"
							aria-selected={true}
						>
							<span>{tech}</span>
							<button
								className={styles.tabClose}
								aria-label={`Remove ${tech} filter`}
								onClick={() => onRemoveFilter(tech)}
								type="button"
							>
								<FaIcon
									iconName="xmark"
									iconGroup="fas"
								/>
							</button>
						</div>
					))}
				</div>
			)}

			{projects.length > 0 ? (
				<div className={styles.grid}>
					{projects.map(project => (
						<ProjectCard
							key={project.id}
							project={project}
						/>
					))}
				</div>
			) : (
				<div className={styles.empty}>
					<span>{'// no projects found for the selected technologies'}</span>
				</div>
			)}
		</div>
	);
};
