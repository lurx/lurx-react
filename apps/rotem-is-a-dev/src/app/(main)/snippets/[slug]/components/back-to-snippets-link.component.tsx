import Link from 'next/link';
import styles from '../snippet.module.scss';

export const BackToSnippetsLink = () => (
	<div className={styles.backLink}>
		<Link href="/snippets" className={styles.backLinkText}>
			&larr; Back to snippets
		</Link>
	</div>
);
