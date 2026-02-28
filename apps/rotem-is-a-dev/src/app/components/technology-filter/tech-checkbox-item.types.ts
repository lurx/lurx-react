export type TechCheckboxItemProps = {
	tech: string;
	isChecked: boolean;
	onToggle: (tech: string) => void;
	iconInfo?: IconData;
}
