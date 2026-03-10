import { toCodeLike } from '@/app/utils/to-code-like.util';

import { AuthButton, ContactButton, DownloadCVButton, MobileMenu, NavItemsList, NavbarLogo } from './components';
import styles from './navbar.module.scss';

export const Navbar = () => {
	const title = toCodeLike('Rotem Horovitz', { convertCase: 'kebab-case' });
	return (
		<header>
			<nav
				className={styles.navbar}
				aria-label="Main navigation"
			>
				<NavbarLogo title={title} />
				<NavItemsList />
				<DownloadCVButton />
				<ContactButton hidden/>
				<AuthButton />
				<MobileMenu />
			</nav>
		</header>
	);
};
