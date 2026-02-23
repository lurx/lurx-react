'use client';

import { useShikiTokens } from '@/lib/shiki';
import classNames from 'classnames';
import styles from './code-block.module.scss';

interface CodeBlockProps {
	code: string;
	language?: 'typescript' | 'javascript' | 'json';
	className?: string;
	'aria-label'?: string;
}

export const CodeBlock = ({
	code,
	language = 'typescript',
	className,
	'aria-label': ariaLabel,
}: CodeBlockProps) => {
	const shikiLines = useShikiTokens({ code, language });

	return (
		<pre
			className={classNames(styles.code, className)}
			aria-label={ariaLabel}
		>
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
								{line.tokens.some(token => token.content !== ' ') && '\n'}
							</span>
						))
					: code}
			</code>
		</pre>
	);
};
