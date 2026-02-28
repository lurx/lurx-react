export type TechnologyFilterProps = {
	technologies: string[];
	selected: string[];
	onToggle: (tech: string) => void;
	sectionLabel?: string;
}
