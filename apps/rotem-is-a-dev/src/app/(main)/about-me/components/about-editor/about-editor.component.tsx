'use client';

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

	const renderShikiLine = (index: number) => (
		<span className={styles.codeLine}>
			{shikiLines?.[index].tokens.map((token, tokenIndex) => (
				<span
					key={`token-${index}-${tokenIndex}`}
					style={{ color: token.color }}
				>
					{token.content}
				</span>
			))}
		</span>
	);

	const renderPlainLine = (index: number) => (
		<span className={styles.codeLine}>{plainLines[index]}</span>
	);

	return (
		<div
			className={styles.editor}
			aria-label={`${content.title} content`}
		>
			{Array.from({ length: lineCount }, (_, index) => (
				<div key={`row-${index}`} className={styles.line}>
					<span className={styles.lineNumber}>{index + 1}</span>
					{shikiLines ? renderShikiLine(index) : renderPlainLine(index)}
				</div>
			))}
		</div>
	);
};
