'use client';

import {
	createContext,
	useCallback,
	useContext,
	useLayoutEffect,
	useMemo,
	useState,
} from 'react';
import type { ReactNode } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import {
	DARK_THEME_QUERY,
	DEFAULT_THEME,
	THEME_STORAGE_KEY,
} from './theme.constants';
import {
	applyTheme,
	oppositeTheme,
	readStoredTheme,
	resolveTheme,
} from './theme.helpers';
import type { ThemeContextValue } from './theme.context.types';
import type { Theme } from './theme.types';

const SSR_SAFE = { initializeWithValue: false } as const;

export const themeContext = createContext<Nullable<ThemeContextValue>>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	// Both renders have to start from the same value: the server has no
	// localStorage, so reading it in the initializer would desync hydration and
	// React would leave the *server's* markup in place. The stored theme is
	// picked up on mount instead, before paint.
	const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
	const [hasReadStoredTheme, setHasReadStoredTheme] = useState(false);

	const prefersDark = useMediaQuery(DARK_THEME_QUERY, SSR_SAFE);

	const resolvedTheme = useMemo(
		() => resolveTheme(theme, prefersDark),
		[theme, prefersDark],
	);

	const isThemeDefault = theme === DEFAULT_THEME;

	const selectTheme = useCallback((next: Theme) => {
		setTheme(next);
	}, []);

	const toggleTheme = useCallback(() => {
		setTheme(oppositeTheme(resolvedTheme));
	}, [resolvedTheme]);

	const resetTheme = useCallback(() => {
		setTheme(DEFAULT_THEME);
	}, []);

	useLayoutEffect(() => {
		setTheme(readStoredTheme());
		setHasReadStoredTheme(true);
	}, []);

	useLayoutEffect(() => {
		// Until the stored value is known, the boot script's attribute is the
		// better answer — overwriting it here would flash the default theme.
		if (!hasReadStoredTheme) return;

		applyTheme(theme);
		localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
	}, [theme, hasReadStoredTheme]);

	const value = useMemo(
		() => ({
			theme,
			resolvedTheme,
			isThemeDefault,
			selectTheme,
			toggleTheme,
			resetTheme,
		}),
		[
			theme,
			resolvedTheme,
			isThemeDefault,
			selectTheme,
			toggleTheme,
			resetTheme,
		],
	);

	return (
		<themeContext.Provider value={value}>{children}</themeContext.Provider>
	);
};

export const useThemeContext = (): ThemeContextValue => {
	const ctx = useContext(themeContext);
	if (ctx === null) {
		throw new Error('useThemeContext must be used within ThemeProvider');
	}
	return ctx;
};
