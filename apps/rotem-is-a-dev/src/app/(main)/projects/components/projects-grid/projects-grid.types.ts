import type { Project } from '../../data/projects.data';

export type ProjectsGridProps = {
	projects: Project[];
	onViewProject?: (project: Project) => void;
	onCommentClick?: (project: Project) => void;
}
