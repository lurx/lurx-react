import { byPrefixAndName } from '@awesome.me/kit-1d40de302b/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../navbar.module.scss';
import Link from 'next/link';

interface NavBarLogoProps {
	title: string;
}

export const NavbarLogo = ({ title }: NavBarLogoProps) => (
	<span className={styles.logo}>
		<span data-animate-text="logo">
			<Link href="/">
				{/* <span className={styles.logoLink}> */}
				{title}
				{/* </span> */}
			</Link>

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
	</span>
);
