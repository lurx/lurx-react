import type { Project } from '../../data/projects.data';

export type ProjectCardProps = {
	project: Project;
	onViewProject?: (project: Project) => void;
	onCommentClick?: (project: Project) => void;
}
