import styles from './error-page.module.scss';

interface ErrorPageButtonProps {
	reset: () => void;
}

export const ErrorPageButton = ({ reset }: ErrorPageButtonProps) => (
	<button
		onClick={reset}
		className={styles.retryButton}
	>
		Try again
	</button>
);
