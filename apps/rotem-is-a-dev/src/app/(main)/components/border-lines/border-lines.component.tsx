import styles from './border-lines.module.scss';

export const BorderLines = () => (
	<>
		<span className={styles.navBorder} aria-hidden="true" />
		<span className={styles.footerBorder} aria-hidden="true" />
	</>
);
