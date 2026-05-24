export type SnippetTagFilterProps = {
	tags: string[];
	selected: string[];
	onToggleAction: (tag: string) => void;
};
