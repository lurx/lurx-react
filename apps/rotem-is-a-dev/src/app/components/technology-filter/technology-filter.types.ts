export type TechnologyFilterProps = {
	technologies: Technology[];
	selected: Technology[];
	onToggleAction: (tech: Technology) => void;
	sectionLabel?: string;
}
