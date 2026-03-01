import { AsciiArtRenderer } from '../ascii-art-renderer';
import {
	EMPTY_STATE_ASCII_ART_MAP,
	EMPTY_STATE_ASCII_LABELS_MAP,
} from './empty-state.constants';
import styles from './empty-state.module.scss';
import type { EmptyStateProps } from './empty-state.types';

export const EmptyState = ({ variant, children }: EmptyStateProps) => {
	const asciiArt = EMPTY_STATE_ASCII_ART_MAP[variant] ?? '';
	const asciiArtLabel =
		EMPTY_STATE_ASCII_LABELS_MAP[variant] ?? variant.toLowerCase();

	return (
		<div className={styles.emptyState}>
			<AsciiArtRenderer
				asciiArt={asciiArt}
				asciiArtLabel={asciiArtLabel}
			/>
			<p>{children}</p>
		</div>
	);
};
