export interface NavItemConfig {
	label: string;
	href: string;
	enabled: boolean;
}

export const NAV_ITEMS: NavItemConfig[] = [
	{ label: 'hello', href: '/', enabled: true },
	{ label: 'about-me', href: '/about-me', enabled: true },
	{ label: 'projects', href: '/projects', enabled: false },
];
