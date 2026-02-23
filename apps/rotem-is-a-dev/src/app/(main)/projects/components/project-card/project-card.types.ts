import type { Project } from '../../data/projects.data';

export interface ProjectCardProps {
	project: Project;
	onViewProject?: (project: Project) => void;
}
