import { CodeBlock } from '@/app/components';
import { memo } from 'react';
import styles from './hero-snippets.module.scss';
import type { SnippetSlideProps } from './hero-snippet-slide.types';

export const SnippetSlide = memo(({ title, code, opacity }: SnippetSlideProps) => {
	return (
		<div
			className={styles.slide}
			style={{ opacity }}
		>
			<p className={styles.slideLabel}>{title}</p>
			<CodeBlock
				code={code}
				className={styles.code}
			/>
		</div>
	);
});
SnippetSlide.displayName = 'SnippetSlide';
