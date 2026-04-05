import Link from "next/link";
import styles from '../blog-post.module.scss';
import { FullscreenToggle } from './fullscreen-toggle';

export const BackToBlogLink = () => (
	<div className={styles.backLink}>
		<div className={styles.backLinkRow}>
			<Link
				href="/blog"
				className={styles.backLinkText}
			>
				&larr; Back to blog
			</Link>
			<FullscreenToggle />
		</div>
		<div
			className={styles.progressBar}
			aria-hidden="true"
		/>
	</div>
);
