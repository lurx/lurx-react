import type { Theme } from '@/app/layout/accessibility-widget/accessibility-widget.types';

export type ThemeOptionProps = {
	theme: Theme;
	label: string;
	isActive: boolean;
	onSelectAction: (theme: Theme) => void;
};
