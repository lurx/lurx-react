import { GithubLink } from '../components/github-link.component';
import { RoleLine } from '../components/role-line.component';
import styles from '../hero-section.module.scss';
import { heroSectionStrings } from '../hero-section.strings';

export const HeroIntroduction = () => (
	<div className={styles.left}>
		<p className={styles.greeting}>{heroSectionStrings.greeting}</p>
		<h1 className={styles.name}>{heroSectionStrings.name}</h1>
		<RoleLine />
		<GithubLink />
	</div>
);
