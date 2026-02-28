import { toCodeLike } from '@/app/utils/to-code-like.util';
import type { Project } from '../../data/projects.data';
import { ProjectCard } from '../project-card/project-card.component';
import styles from './projects-grid.module.scss';

interface ProjectsGridProps {
	projects: Project[];
	onViewProject?: (project: Project) => void;
}

export const ProjectsGrid = ({
	projects,
	onViewProject,
}: ProjectsGridProps) => {
	const gridContent = projects.length > 0
		? <div className={styles.grid}>
				{projects.map(project => (
					<ProjectCard
						key={project.id}
						project={project}
						onViewProject={onViewProject}
					/>
				))}
			</div>
		: <div className={styles.empty}>
				<span>
					{toCodeLike('no projects found for the selected technologies', {
						convertCase: 'comment',
					})}
				</span>
			</div>;

	return (
		<div className={styles.container}>
			{gridContent}
		</div>
	);
};
