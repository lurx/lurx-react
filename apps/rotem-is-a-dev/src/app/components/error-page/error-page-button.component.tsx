import styles from './error-page.module.scss';
import type { ErrorPageButtonProps } from './error-page-button.types';

export const ErrorPageButton = ({ reset }: ErrorPageButtonProps) => (
	<button
		onClick={reset}
		className={styles.retryButton}
	>
		Try again
	</button>
);
