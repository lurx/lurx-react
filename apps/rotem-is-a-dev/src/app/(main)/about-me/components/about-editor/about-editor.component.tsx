'use client';

import { ShikiCode } from '@/app/components';
import { useShikiTokens } from '@/lib/shiki';
import { useMemo } from 'react';
import { toLanguage, toLines } from './about-editor.helpers';
import styles from './about-editor.module.scss';
import type { AboutEditorProps } from './about-editor.types';

export const AboutEditor = ({ content }: AboutEditorProps) => {
	const plainLines = useMemo(() => toLines(content), [content]);
	const code = useMemo(() => plainLines.join('\n'), [plainLines]);
	const shikiLines = useShikiTokens({ code, language: toLanguage(content) });

	const lineCount = shikiLines ? shikiLines.length : plainLines.length;

	return (
		<div
			className={styles.editor}
			aria-label={`${content.title} content`}
		>
			<div className={styles.lineNumbers}>
				{Array.from({ length: lineCount }, (_, index) => (
					<span
						key={`ln-${index}`}
						className={styles.lineNumber}
					>
						{index + 1}
					</span>
				))}
			</div>
			<div className={styles.codeContent}>
				{shikiLines
					? <ShikiCode lines={shikiLines} />
					: plainLines.map((line, index) => (
							<span key={`plain-${index}[${line}]`}>
								{line}
								{'\n'}
							</span>
						))}
			</div>
		</div>
	);
};
