'use client';

import { useResponsive } from '@/hooks';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '../nav-items.constants';
import styles from '../navbar.module.scss';
import { NavItem } from './nav-item.component';

export const NavItemsList = () => {
	const { isMobile } = useResponsive();
	const pathname = usePathname();

	if (isMobile) return null;

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
