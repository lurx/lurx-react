import type { Project } from '../../data/projects.data';

export type ProjectCardProps = {
	project: Project;
	onViewProjectAction?: (project: Project) => void;
	onCommentClickAction?: (project: Project) => void;
}
