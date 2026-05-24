export type TagFilterProps = {
	tags: string[];
	selected: string[];
	onToggleAction: (tag: string) => void;
};
