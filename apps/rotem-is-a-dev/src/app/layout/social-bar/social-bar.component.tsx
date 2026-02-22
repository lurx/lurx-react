import { AccessibilityWidget } from '../accessibility-widget/accessibility-widget.component';
import { SocialLinkList } from './components/social-links-list.component';
import { leftSideSocialLinks } from './social-bar.constants';
import styles from './social-bar.module.scss';

export const SocialBar = () => {
	return (
		<footer
			className={styles.socialBar}
			aria-label="Social links"
		>
			<div className={styles.left}>
				<span className={styles.label} data-animate-text="footer-label">find me in:</span>
				<SocialLinkList links={leftSideSocialLinks} />
			</div>
			<div className={styles.right}>
				<AccessibilityWidget />
			</div>
		</footer>
	);
};
