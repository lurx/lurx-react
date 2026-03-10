import { EMPTY_STATE_VARIANTS, EmptyState } from '@/app/components';
import { toCodeLike } from '@/app/utils/to-code-like.util';
import { ProjectCard } from '../project-card';
import styles from './projects-grid.module.scss';
import type { ProjectsGridProps } from './projects-grid.types';

export const ProjectsGrid = ({
	projects,
	onViewProject,
	onCommentClick,
}: ProjectsGridProps) => {
	const gridContent = projects.length > 0
		? <div className={styles.grid}>
				{projects.map(project => (
					<ProjectCard
						key={project.id}
						project={project}
						onViewProject={onViewProject}
						onCommentClick={onCommentClick}
					/>
				))}
			</div>
		: <div className={styles.empty}>
				<EmptyState variant={EMPTY_STATE_VARIANTS.NO_DATA}>
					{toCodeLike('no projects found for the selected technologies', {
						convertCase: 'comment',
					})}
				</EmptyState>
			</div>;

	return (
		<div className={styles.container}>
			{gridContent}
		</div>
	);
};
