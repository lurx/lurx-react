export type BlogTagFilterProps = {
	tags: Technology[];
	selected: Technology[];
	onToggleAction: (tag: Technology) => void;
};
