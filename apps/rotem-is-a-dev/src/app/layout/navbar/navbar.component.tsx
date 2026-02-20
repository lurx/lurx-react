import { byPrefixAndName } from '@awesome.me/kit-1d40de302b/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavItemsList } from './components/nav-items-list.component';
import styles from './navbar.module.scss';

export const Navbar = () => {
	return (
		<nav
			className={styles.navbar}
			role="navigation"
			aria-label="Main navigation"
		>
			<span className={styles.logo}>
				rotem-horovitz
				<FontAwesomeIcon icon={byPrefixAndName.fal['rectangle-beta']} size="xl" className={styles.betaIcon} />
			</span>
			<NavItemsList />

			<a
				href="#contact-me"
				className={styles.contact}
			>
				_contact-me
			</a>
		</nav>
	);
};
