import { CodeBlock } from '@/app/components';
import { memo } from 'react';
import styles from './hero-snippets.module.scss';

interface SnippetSlideProps {
	title: string;
	code: string;
	opacity: number;
}

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
