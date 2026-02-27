import { AsciiArtRenderer } from '../ascii-art-renderer';
import styles from './status-page.module.scss';
import type { StatusPageComponentProps } from './status-page.types';

export const StatusPage = ({
	asciiArt,
	asciiArtLabel,
	children,
}: StatusPageComponentProps) => {
	return (
		<div className={styles.container}>
			<AsciiArtRenderer asciiArt={asciiArt} asciiArtLabel={asciiArtLabel} />
			<div className={styles.content}>{children}</div>
		</div>
	);
};
