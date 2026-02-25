import styles from './simple-loader.module.scss';

export const SimpleLoader = () => {
	return (
		<div
			className={styles.simpleLoader}
			data-testid="simple-loader"
		/>
	);
};
