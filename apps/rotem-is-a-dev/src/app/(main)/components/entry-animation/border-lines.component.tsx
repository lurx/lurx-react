import styles from './border-lines.module.scss';

export const BorderLines = () => (
	<>
		<span
			data-border-h="nav"
			className={styles.navBorder}
			aria-hidden="true"
		/>
		<span
			data-border-h="footer"
			className={styles.footerBorder}
			aria-hidden="true"
		/>
	</>
);
