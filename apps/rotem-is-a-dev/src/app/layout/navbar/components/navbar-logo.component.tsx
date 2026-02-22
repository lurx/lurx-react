import { byPrefixAndName } from '@awesome.me/kit-1d40de302b/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../navbar.module.scss';

interface NavBarLogoProps {
	title: string;
}

export const NavbarLogo = ({ title }: NavBarLogoProps) => (
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
);
