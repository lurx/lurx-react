import type { VerdictBoxProps } from './verdict-box.types';
import styles from './verdict-box.module.scss';

export function VerdictBox({ title, children }: Readonly<VerdictBoxProps>) {
	return (
		<div className={styles.box}>
			<div className={styles.title}>{title}</div>
			{children}
		</div>
	);
}
