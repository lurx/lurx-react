'use client';

import { HeaderThemeSwitcher } from './components/header-theme-switcher.component';

export function Header() {
	return (
		<header className="navbar bg-base-200 shadow-sm">
			<div className="flex-1">
				<a href="/" className="btn btn-ghost text-xl font-bold">
					Story Wise
				</a>
			</div>
			<HeaderThemeSwitcher />
		</header>
	);
}
