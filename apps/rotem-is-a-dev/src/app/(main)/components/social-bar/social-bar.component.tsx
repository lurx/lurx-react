import styles from './social-bar.module.scss';

const TWITTER_URL = 'https://x.com/lurxie';
const LINKEDIN_URL = 'https://linkedin.com/in/rotem-lurx-horovitz-9601705';
const GITHUB_URL = 'https://github.com/lurx';

export const SocialBar = () => {
	return (
		<footer
			className={styles.socialBar}
			aria-label="Social links"
		>
			<div className={styles.left}>
				<span className={styles.label}>find me in:</span>

				<a
					href={TWITTER_URL}
					target="_blank"
					rel="noopener noreferrer"
					className={styles.iconLink}
					aria-label="X (Twitter)"
				>
					&#120143;
				</a>

				<a
					href={LINKEDIN_URL}
					target="_blank"
					rel="noopener noreferrer"
					className={styles.iconLink}
					aria-label="LinkedIn"
				>
					in
				</a>
			</div>

			<a
				href={GITHUB_URL}
				target="_blank"
				rel="noopener noreferrer"
				className={styles.username}
			>
				@lurx
				<span
					className={styles.githubIcon}
					aria-hidden="true"
				>
					&#10070;
				</span>
			</a>
		</footer>
	);
};
