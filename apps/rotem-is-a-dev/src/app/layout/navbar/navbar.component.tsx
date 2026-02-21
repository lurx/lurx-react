import { FaIcon } from '@/app/components';
import { byPrefixAndName } from '@awesome.me/kit-1d40de302b/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavItem } from './components/nav-item.component';
import { NavItemsList } from './components/nav-items-list.component';
import styles from './navbar.module.scss';
import { toCodeLike } from '@/app/utils/to-code-like.util';
import { AccessibilityWidget } from './components/accessibility-widget/accessibility-widget.component';

export const Navbar = () => {
	const title = toCodeLike('Rotem Horovitz', { convertCase: 'kebab-case' });
	return (
		<header>
			<nav
				className={styles.navbar}
				role="navigation"
				aria-label="Main navigation"
			>
				<span className={styles.logo}>
					<span data-animate-text="logo">{title}</span>
					<span
						data-animate-icon
						aria-hidden="true"
					>
						<FontAwesomeIcon
							icon={byPrefixAndName.fal['rectangle-beta']}
							size="xl"
							className={styles.betaIcon}
						/>
					</span>
				</span>
				<NavItemsList />

				<NavItem
					label="Download CV"
					icon={
						<span
							data-animate-icon
							aria-hidden="true"
						>
							<FaIcon
								iconName="file-pdf"
								iconGroup="fal"
								className={styles.downloadIcon}
							/>
						</span>
					}
					href="#downloadPdf"
					active={false}
					data-animate-text="download-cv"
				/>
				<NavItem
					label="Contact me"
					href="#contact-me"
					className={styles.contact}
					aria-label="Contact me"
					active={false}
					data-animate-text="contact"
				/>
				<AccessibilityWidget />
			</nav>
		</header>
	);
};
