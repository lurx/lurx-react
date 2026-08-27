import type { ResolvedTheme, Theme } from './theme.types';

export type ThemeContextValue = {
	theme: Theme;
	resolvedTheme: ResolvedTheme;
	isThemeDefault: boolean;
	selectTheme: (theme: Theme) => void;
	toggleTheme: () => void;
	resetTheme: () => void;
};
