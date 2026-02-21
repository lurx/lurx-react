'use client';

import { useMemo } from 'react';
import type { AboutFileContent } from '../../data/about-files.data';
import styles from './about-editor.module.scss';

const COMMENT_WRAP_WIDTH = 38;

const wrapWords = (text: string, maxWidth: number): string[] => {
	const words = text.split(' ');
	const lines: string[] = [];
	let current = '';

	for (const word of words) {
		if (current === '') {
			current = word;
		} else if (current.length + 1 + word.length <= maxWidth) {
			current += ` ${word}`;
		} else {
			lines.push(current);
			current = word;
		}
	}

	if (current) lines.push(current);
	return lines;
};

const toJsdocLines = ({ title, paragraphs }: AboutFileContent): string[] => {
	const lines = ['/**', ` * ${title}`];

	paragraphs.forEach((paragraph, index) => {
		wrapWords(paragraph, COMMENT_WRAP_WIDTH).forEach((line) =>
			lines.push(` * ${line}`),
		);
		if (index < paragraphs.length - 1) lines.push(' *');
	});

	lines.push(' *', ' */');
	return lines;
};

export interface AboutEditorProps {
	content: AboutFileContent;
}

export const AboutEditor = ({ content }: AboutEditorProps) => {
	const lines = useMemo(() => toJsdocLines(content), [content]);

	return (
		<div
			className={styles.editor}
			aria-label={`${content.title} content`}
		>
			<div className={styles.lineNumbers}>
				{lines.map((_, index) => (
					<span
						key={index}
						className={styles.lineNumber}
					>
						{index + 1}
					</span>
				))}
			</div>
			<div className={styles.codeContent}>
				{lines.map((line, index) => (
					<span key={index}>
						{line}
						{'\n'}
					</span>
				))}
			</div>
		</div>
	);
};
