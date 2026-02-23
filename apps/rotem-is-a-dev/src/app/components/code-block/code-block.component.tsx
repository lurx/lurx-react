'use client';

import { useShikiTokens } from '@/lib/shiki';
import classNames from 'classnames';
import styles from './code-block.module.scss';

interface CodeBlockProps {
	code: string;
	language?: 'typescript' | 'javascript' | 'json';
	className?: string;
	numberOfLines?: number;
	'aria-label'?: string;
}

export const CodeBlock = ({
	code,
	language = 'typescript',
	className,
	numberOfLines,
	'aria-label': ariaLabel,
}: CodeBlockProps) => {
	const shikiLines = useShikiTokens({ code, language });

	return (
		<div className={classNames(styles.wrapper, numberOfLines && styles.withLineNumbers, className)}>
			{numberOfLines && (
				<pre className={styles.lineNumbers} aria-hidden="true">
					{Array.from({ length: numberOfLines }, (_, index) => index + 1).join('\n')}
				</pre>
			)}
			<pre className={styles.code} aria-label={ariaLabel}>
				<code>
					{shikiLines
						? shikiLines.map((line, index) => (
								<span key={line.toString() + index}>
									{line.tokens.map((token, tokenIndex) => (
										<span
											key={token.content + tokenIndex}
											style={{ color: token.color }}
										>
											{token.content}
										</span>
									))}
									{'\n'}
								</span>
							))
						: code}
				</code>
			</pre>
		</div>
	);
};
