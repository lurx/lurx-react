'use client';

import { ThemeSwitcher } from '../theme-switcher/theme-switcher';

export function Header() {
	return (
		<header className="navbar bg-base-200 shadow-sm">
			<div className="flex-1">
				<a href="/" className="btn btn-ghost text-xl font-bold">
					Story Wise
				</a>
			</div>
			<div className="flex-none gap-2">
				<ThemeSwitcher />
			</div>
		</header>
	);
}
