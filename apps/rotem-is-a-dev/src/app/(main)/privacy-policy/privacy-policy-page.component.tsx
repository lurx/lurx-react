import type { PrivacyPolicyPageProps } from './privacy-policy-page.types';
import styles from './privacy-policy-page.module.scss';

export const PrivacyPolicyPage = ({ page }: PrivacyPolicyPageProps) => {
	return (
		<div className={styles.page}>
			<h1 className={styles.title}>{page.title}</h1>
			<p className={styles.lastUpdated}>Last updated: {page.lastUpdated}</p>

			<div
				className={styles.content}
				dangerouslySetInnerHTML={{ __html: page.content }}
			/>
		</div>
	);
};
