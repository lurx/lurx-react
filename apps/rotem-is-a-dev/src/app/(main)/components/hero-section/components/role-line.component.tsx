import { heroSectionStrings } from '../hero-section.strings';
import styles from '../hero-section.module.scss';

export const RoleLine = () => (
	<p className={styles.role}>&gt; {heroSectionStrings.role}</p>
);
