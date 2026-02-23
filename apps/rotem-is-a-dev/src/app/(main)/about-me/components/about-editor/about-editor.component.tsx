'use client';

import { useMemo } from 'react';
import type {
	AboutFileContent,
	JsdocFileContent,
	JsonFileContent,
} from '../../data/about-files.data';
import styles from './about-editor.module.scss';
import { useShikiTokens } from '@/lib/shiki';

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

const toJsdocLines = ({ title, paragraphs }: JsdocFileContent): string[] => {
	const lines = ['/**', ` * ${title}`];

	paragraphs.forEach((paragraph, index) => {
		wrapWords(paragraph, COMMENT_WRAP_WIDTH).forEach(line =>
			lines.push(` * ${line}`),
		);
		if (index < paragraphs.length - 1) lines.push(' *');
	});

	lines.push(' *', ' */');
	return lines;
};

const toJsonLines = ({ json }: JsonFileContent): string[] => {
	return JSON.stringify(json, null, 2).split('\n');
};

const toLines = (content: AboutFileContent): string[] => {
	if (content.format === 'json') {
		return toJsonLines(content);
	}
	return toJsdocLines(content);
};

const toLanguage = (content: AboutFileContent): 'javascript' | 'json' =>
	content.format === 'json' ? 'json' : 'javascript';

export interface AboutEditorProps {
	content: AboutFileContent;
}

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
						key={index}
						className={styles.lineNumber}
					>
						{index + 1}
					</span>
				))}
			</div>
			<div className={styles.codeContent}>
				{shikiLines
					? shikiLines.map((line, index) => (
							<span key={index}>
								{line.tokens.map((token, tokenIndex) => (
									<span
										key={tokenIndex}
										style={{ color: token.color }}
									>
										{token.content}
									</span>
								))}
								{'\n'}
							</span>
						))
					: plainLines.map((line, index) => (
							<span key={index}>
								{line}
								{'\n'}
							</span>
						))}
			</div>
		</div>
	);
};
