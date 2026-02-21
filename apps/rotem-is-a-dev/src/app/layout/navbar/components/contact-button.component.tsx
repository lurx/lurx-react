import styles from '../navbar.module.scss';
import { NavItem } from './nav-item.component';

export const ContactButton = () => (
	<NavItem
		label="Contact me"
		href="#contact-me"
		className={styles.contact}
		aria-label="Contact me"
		active={false}
		data-animate-text="contact"
	/>
);
