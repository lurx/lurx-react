'use client';

import { usePathname } from 'next/navigation';
import styles from '../navbar.module.scss';
import { NavItem } from './nav-item.component';

const NAV_ITEMS = [
	{ label: 'hello', href: '/', enabled: true },
	{ label: 'about-me', href: '/about-me', enabled: true },
	{ label: 'projects', href: '/projects', enabled: false },
];

export const NavItemsList = () => {
	const pathname = usePathname();

	const isActivePath = (href: string) => pathname === href;
	return (
		<ul className={styles.nav}>
			{NAV_ITEMS.map(({ label, href, enabled }) => (
				<NavItem
					key={label}
					label={label}
					href={href}
					active={isActivePath(href)}
					enabled={enabled}
					data-animate-text="nav-item"
				/>
			))}
		</ul>
	);
};
