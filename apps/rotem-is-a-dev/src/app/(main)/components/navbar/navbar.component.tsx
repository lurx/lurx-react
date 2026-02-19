import styles from './navbar.module.scss';

const NAV_ITEMS = [
	{ label: '_hello', href: '#hello', active: true },
	{ label: '_about-me', href: '#about-me', active: false },
	{ label: '_projects', href: '#projects', active: false },
];

export const Navbar = () => {
	return (
		<nav
			className={styles.navbar}
			role="navigation"
			aria-label="Main navigation"
		>
			<span className={styles.logo}>rotem-horovitz</span>

			<div className={styles.nav}>
				{NAV_ITEMS.map(({ label, href, active }) => (
					<a
						key={label}
						href={href}
						className={`${styles.navItem}${active ? ` ${styles.active}` : ''}`}
						aria-current={active ? 'page' : undefined}
					>
						{label}
					</a>
				))}
			</div>

			<div className={styles.spacer} />

			<a
				href="#contact-me"
				className={styles.contact}
			>
				_contact-me
			</a>
		</nav>
	);
};
