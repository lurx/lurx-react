import { toCodeLike } from '@/app/utils/to-code-like.util';

import { ContactButton } from './components/contact-button.component';
import { DownloadCVButton } from './components/download-cv-button.component';
import { MobileMenu } from './components/mobile-menu/mobile-menu.component';
import { NavItemsList } from './components/nav-items-list.component';
import { NavbarLogo } from './components/navbar-logo.component';
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
				<MobileMenu />
			</nav>
		</header>
	);
};
