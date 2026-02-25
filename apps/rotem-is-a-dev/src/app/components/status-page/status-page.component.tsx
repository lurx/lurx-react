import { Logo } from '../logo/logo.component';
import styles from './status-page.module.scss';
import type { StatusPageComponentProps } from './status-page.types';

export const StatusPage = ({
	asciiArt,
	asciiArtLabel,
	children,
}: StatusPageComponentProps) => {
	return (
		<div className={styles.container}>
      <Logo animated />
			<pre
				className={styles.asciiArt}
				aria-label={asciiArtLabel}
				aria-hidden={!asciiArtLabel}
			>
				{asciiArt}
			</pre>
			<div className={styles.content}>{children}</div>
		</div>
	);
};
