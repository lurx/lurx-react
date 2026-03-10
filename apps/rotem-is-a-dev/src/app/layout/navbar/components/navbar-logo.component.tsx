import styles from '../navbar.module.scss';
import Link from 'next/link';
import { Logo, LOGO_SIZES } from '@/app/components';
import type { NavBarLogoProps } from './navbar-logo.types';

export const NavbarLogo = ({ title }: NavBarLogoProps) => (
	<span className={styles.logo}>
		<span data-animate-text="logo">
			<Link href="/">
				<span className={styles.logoLink}>
					<Logo size={LOGO_SIZES.ICON} />
					{title}
				</span>
			</Link>
		</span>
	</span>
);
