'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type PropsWithChildren,
} from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
	theme: Theme;
	toggleTheme: () => void;
}

const themeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = (): ThemeContextValue => {
	const ctx = useContext(themeContext);
	if (!ctx) {
		throw new Error('useTheme must be used within ThemeProvider');
	}
	return ctx;
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
	const [theme, setTheme] = useState<Theme>('dark');

	useEffect(() => {
		const stored = localStorage.getItem('theme') as Theme | null;
		const preferred: Theme = window.matchMedia('(prefers-color-scheme: light)').matches
			? 'light'
			: 'dark';
		setTheme(stored ?? preferred);
	}, []);

	useEffect(() => {
		if (theme === 'light') {
			document.documentElement.setAttribute('data-theme', 'light');
		} else {
			document.documentElement.removeAttribute('data-theme');
		}
		localStorage.setItem('theme', theme);
	}, [theme]);

	const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

	return (
		<themeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</themeContext.Provider>
	);
};
