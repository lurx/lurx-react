'use client';

import { useResponsive } from '@/hooks';
import styles from '../navbar.module.scss';
import { NavItem } from './nav-item.component';

export const ContactButton = () => {
	const { isMobile } = useResponsive();

	if (isMobile) return null;

	return (
		<NavItem
			label="Contact me"
			href="#contact-me"
			className={styles.contact}
			aria-label="Contact me"
			active={false}
			data-animate-text="contact"
		/>
	);
};
