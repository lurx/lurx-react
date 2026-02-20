import type { Technology } from '../../data/projects.data';

export interface TechnologyFilterProps {
	technologies: Technology[];
	selected: Technology[];
	onToggle: (tech: Technology) => void;
}
