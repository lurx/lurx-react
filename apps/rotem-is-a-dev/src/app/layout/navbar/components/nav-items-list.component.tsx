import styles from '../navbar.module.scss';
import { NavItem } from './nav-item.component';

const NAV_ITEMS = [
	{ label: '_hello', href: '#hello', active: true, enabled: true },
	{ label: '_about-me', href: '#about-me', active: false, enabled: true },
	{ label: '_projects', href: '#projects', active: false, enabled: false },
];

export const NavItemsList = () => (
	<ul className={styles.nav}>
		{NAV_ITEMS.map(({ label, href, active, enabled }) => (
			<NavItem
				key={label}
				label={label}
				href={href}
				active={active}
				enabled={enabled}
			/>
		))}
	</ul>
);
