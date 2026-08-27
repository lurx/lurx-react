import type { ResolvedTheme, Theme } from './theme.types';

export const THEMES = ['system', 'dark', 'light'] satisfies Theme[];

export const DEFAULT_THEME = 'system' satisfies Theme;

export const THEME_STORAGE_KEY = 'accessibility-theme';

export const THEME_ATTRIBUTE = 'data-theme';

export const DARK_THEME_QUERY = '(prefers-color-scheme: dark)';

export const THEME_LABELS = {
	system: 'System',
	dark: 'Dark',
	light: 'Light',
} satisfies Record<Theme, string>;

/** The icon stands for the theme the button switches *to*, not the current one. */
export const THEME_TOGGLE_ICONS = {
	dark: 'sun-bright',
	light: 'moon',
} satisfies Record<ResolvedTheme, string>;

export const THEME_TOGGLE_LABELS = {
	dark: 'Switch to light theme',
	light: 'Switch to dark theme',
} satisfies Record<ResolvedTheme, string>;
