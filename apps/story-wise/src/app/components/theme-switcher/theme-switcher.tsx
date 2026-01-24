'use client';

import { useEffect, useState } from 'react';

const DAISY_THEMES = [
	'light',
	'dark',
	'cupcake',
	'bumblebee',
	'emerald',
	'corporate',
	'synthwave',
	'retro',
	'cyberpunk',
	'valentine',
	'halloween',
	'garden',
	'forest',
	'aqua',
	'lofi',
	'pastel',
	'fantasy',
	'wireframe',
	'black',
	'luxury',
	'dracula',
	'cmyk',
	'autumn',
	'business',
	'acid',
	'lemonade',
	'night',
	'coffee',
	'winter',
	'dim',
	'nord',
	'sunset',
] as const;

type Theme = (typeof DAISY_THEMES)[number];

const STORAGE_KEY = 'story-wise-theme';

function ThemePreview({ themeName }: { themeName: Theme }) {
	return (
		<div
			data-theme={themeName}
			className="grid grid-cols-2 grid-rows-2 gap-0.5 shrink-0 rounded-md overflow-hidden w-5 h-5"
		>
			<div className="bg-primary" />
			<div className="bg-secondary" />
			<div className="bg-accent" />
			<div className="bg-neutral" />
		</div>
	);
}

export function ThemeSwitcher() {
	const [theme, setTheme] = useState<Theme>('dark');
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
		if (stored && DAISY_THEMES.includes(stored)) {
			setTheme(stored);
			document.documentElement.setAttribute('data-theme', stored);
		}
	}, []);

	const handleThemeChange = (newTheme: Theme) => {
		setTheme(newTheme);
		localStorage.setItem(STORAGE_KEY, newTheme);
		document.documentElement.setAttribute('data-theme', newTheme);
	};

	if (!mounted) {
		return (
			<div className="dropdown dropdown-end">
				<div className="btn btn-ghost btn-sm gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-5 h-5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
						/>
					</svg>
					<span className="hidden sm:inline">Theme</span>
				</div>
			</div>
		);
	}

	return (
		<div className="dropdown dropdown-end">
			<div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-5 h-5"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
					/>
				</svg>
				<span className="hidden sm:inline capitalize">{theme}</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-4 h-4"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
				</svg>
			</div>
			<ul
				tabIndex={0}
				className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-200 rounded-box w-56 max-h-96 overflow-y-auto flex-nowrap"
			>
				{DAISY_THEMES.map(t => (
					<li key={t}>
						<button
							type="button"
							className={`flex items-center gap-3 ${theme === t ? 'active' : ''}`}
							onClick={() => handleThemeChange(t)}
						>
							<ThemePreview themeName={t} />
							<span className="capitalize flex-1">{t}</span>
							{theme === t && (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="w-4 h-4"
								>
									<path
										fillRule="evenodd"
										d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
										clipRule="evenodd"
									/>
								</svg>
							)}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
