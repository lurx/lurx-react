import { FaIcon } from '@/app/components';
import { byPrefixAndName } from '@awesome.me/kit-1d40de302b/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavItem } from './components/nav-item.component';
import { NavItemsList } from './components/nav-items-list.component';
import styles from './navbar.module.scss';
import { toCodeLike } from '@/app/utils/to-code-like.util';

export const Navbar = () => {
  const title = toCodeLike('Rotem Horovitz', { convertCase: 'kebab-case' });
	return (
		<nav
			className={styles.navbar}
			role="navigation"
			aria-label="Main navigation"
		>
			<span className={styles.logo}>
				{title}
				<FontAwesomeIcon
					icon={byPrefixAndName.fal['rectangle-beta']}
					size="xl"
					className={styles.betaIcon}
				/>
			</span>
			<NavItemsList />

			<NavItem
				label="Download CV"
				icon={
					<FaIcon
						iconName="file-pdf"
						iconGroup="fal"
						className={styles.downloadIcon}
					/>
				}
				href="#downloadPdf"
				active={false}
			/>
			<a
				href="#contact-me"
				className={styles.contact}
				aria-label="Contact me"
			>
				_contact-me
			</a>
		</nav>
	);
};
