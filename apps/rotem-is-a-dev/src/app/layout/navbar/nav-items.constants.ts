import type { NavItemConfig } from './nav-items.types';

export type { NavItemConfig } from './nav-items.types';

export const NAV_ITEMS: NavItemConfig[] = [
	{ label: 'hello', href: '/', enabled: true },
	{ label: 'about-me', href: '/about-me', enabled: true },
	{ label: 'games', href: '/games', enabled: true },
	{ label: 'projects', href: '/projects', enabled: true },
	{ label: 'blog', href: '/blog', enabled: true },
];
