export type TechCheckboxItemProps = {
	tech: Technology;
	isChecked: boolean;
	onToggleAction: (tech: Technology) => void;
	iconInfo?: IconData;
}
