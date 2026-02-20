'use client';

import { usePathname } from 'next/navigation';
import styles from '../navbar.module.scss';
import { NavItem } from './nav-item.component';

const NAV_ITEMS = [
	{ label: '_hello', href: '/#hello', enabled: true },
	{ label: '_about-me', href: '/about-me', enabled: true },
	{ label: '_projects', href: '#projects', enabled: false },
];

export const NavItemsList = () => {
	const pathname = usePathname();

	return (
		<ul className={styles.nav}>
			{NAV_ITEMS.map(({ label, href, enabled }) => (
				<NavItem
					key={label}
					label={label}
					href={href}
					active={
						label === '_hello'
							? pathname === '/'
							: label === '_about-me'
								? pathname === '/about-me'
								: false
					}
					enabled={enabled}
				/>
			))}
		</ul>
	);
};
