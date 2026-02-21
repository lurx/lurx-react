import { toCodeLike } from '@/app/utils/to-code-like.util';
import styles from '../hero-section.module.scss';

const GITHUB_URL = 'https://github.com/lurx';

export const GithubLink = () => (
	<div className={styles.codeBlock}>
		<p className={`${styles.codeLine} ${styles.commentText}`} data-hero-intro="comment">
			{toCodeLike('find my profile on Github:', { convertCase: 'comment' })}
		</p>
		<p className={`${styles.codeLine} ${styles.constLine}`} data-hero-intro="const">
			<span className={styles.keyword}>const&nbsp;</span>
			<span className={styles.varName}>githubLink</span>
			<span className={styles.equals}>&nbsp;=&nbsp;</span>
			<a
				href={GITHUB_URL}
				target="_blank"
				rel="noopener noreferrer"
				className={styles.stringValue}
				aria-label="GitHub profile"
			>
				&quot;{GITHUB_URL}&quot;
			</a>;
		</p>
	</div>
);
