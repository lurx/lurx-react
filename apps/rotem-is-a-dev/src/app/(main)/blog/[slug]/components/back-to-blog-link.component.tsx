import Link from "next/link";
import styles from '../blog-post.module.scss';

export const BackToBlogLink = () => (
	<div className={styles.backLink}>
		<Link
			href="/blog"
			className={styles.backLinkText}
		>
			&larr; Back to blog
		</Link>
		<div
			className={styles.progressBar}
			aria-hidden="true"
		/>
	</div>
);
