import { FaIcon } from '@/app/components';
import { toCodeLike } from '@/app/utils/to-code-like.util';
import { AccessibilityWidget } from './components/accessibility-widget/accessibility-widget.component';
import { NavItem } from './components/nav-item.component';
import { NavItemsList } from './components/nav-items-list.component';
import { NavLogo } from './components/navbar-logo.component';
import styles from './navbar.module.scss';
import { DownloadCVButton } from './components/download-cv-button.component';
import { ContactButton } from './components/contact-button.component';

export const Navbar = () => {
	const title = toCodeLike('Rotem Horovitz', { convertCase: 'kebab-case' });
	return (
		<header>
			<nav
				className={styles.navbar}
				role="navigation"
				aria-label="Main navigation"
			>
				<NavLogo title={title} />
				<NavItemsList />
				<DownloadCVButton />
				<ContactButton />
				<AccessibilityWidget />
			</nav>
		</header>
	);
};
