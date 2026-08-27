import {
	DEFAULT_THEME,
	THEME_ATTRIBUTE,
	THEME_STORAGE_KEY,
	THEMES,
} from './theme.constants';
import type { ResolvedTheme, Theme } from './theme.types';

export function readStoredTheme(): Theme {
	try {
		const stored = localStorage.getItem(THEME_STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored) as Theme;
			if (THEMES.includes(parsed)) return parsed;
		}
	} catch {
		/* ignore invalid data */
	}
	return DEFAULT_THEME;
}

export function applyTheme(theme: Theme): void {
	// No attribute means "follow the OS" — the prefers-color-scheme block in
	// global.scss owns that case, so removing it is the system setting.
	if (theme === DEFAULT_THEME) {
		document.documentElement.removeAttribute(THEME_ATTRIBUTE);
		return;
	}
	document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
}

export function resolveTheme(theme: Theme, prefersDark: boolean): ResolvedTheme {
	if (theme === DEFAULT_THEME) return prefersDark ? 'dark' : 'light';
	return theme;
}

/** Toggling always lands on an explicit choice, never back on `system`. */
export function oppositeTheme(resolved: ResolvedTheme): ResolvedTheme {
	return resolved === 'dark' ? 'light' : 'dark';
}
