import type { Project } from '../../data/projects.data';

export type ProjectsGridProps = {
	projects: Project[];
	onViewProjectAction?: (project: Project) => void;
	onCommentClickAction?: (project: Project) => void;
}
