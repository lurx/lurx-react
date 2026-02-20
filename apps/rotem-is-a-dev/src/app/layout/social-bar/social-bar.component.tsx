import { SocialLinkList } from './components/social-links-list.component';
import {
	leftSideSocialLinks,
	rightSideSocialLinks,
} from './social-bar.constants';
import styles from './social-bar.module.scss';

export const SocialBar = () => {
	return (
		<footer
			className={styles.socialBar}
			aria-label="Social links"
		>
			<div className={styles.left}>
				<span className={styles.label}>find me in:</span>
				<SocialLinkList links={leftSideSocialLinks} />
			</div>
			<div className={styles.right}>
				<SocialLinkList links={rightSideSocialLinks} />
			</div>
		</footer>
	);
};
