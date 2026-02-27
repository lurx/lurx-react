import styles from './ascii-art-renderer.module.scss';
import type { AsciiArtRendererProps } from './ascii-art-renderer.types';

export const AsciiArtRenderer = ({
	asciiArt,
	asciiArtLabel,
}: AsciiArtRendererProps) => (
	<pre
		className={styles.asciiArt}
		aria-label={asciiArtLabel}
		aria-hidden={!asciiArtLabel}
	>
		{asciiArt}
	</pre>
);
