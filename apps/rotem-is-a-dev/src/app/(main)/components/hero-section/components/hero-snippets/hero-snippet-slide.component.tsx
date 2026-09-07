import { CodeBlock } from '@/app/components';
import Link from 'next/link';
import { memo } from 'react';
import styles from './hero-snippets.module.scss';
import type { SnippetSlideProps } from './hero-snippet-slide.types';

export const SnippetSlide = memo(({ title, code, opacity }: SnippetSlideProps) => (
	<Link
		href={`/snippets/${title}`}
		prefetch={false}
		className={styles.slide}
		style={{ opacity }}
		aria-label={`Read the ${title} snippet`}
	>
		<p className={styles.slideLabel}>{title}</p>
		<CodeBlock
			code={code}
			className={styles.code}
		/>
	</Link>
));
SnippetSlide.displayName = 'SnippetSlide';
