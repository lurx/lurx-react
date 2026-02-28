import { highlightCode } from '@/lib/shiki/highlight-code';
import classNames from 'classnames';
import styles from './code-block.module.scss';

type ServerCodeBlockProps = {
	code: string;
	language?: 'typescript' | 'javascript' | 'json';
	className?: string;
	numberOfLines?: number;
	'aria-label'?: string;
}

export const ServerCodeBlock = async ({
	code,
	language = 'typescript',
	className,
	numberOfLines,
	'aria-label': ariaLabel,
}: ServerCodeBlockProps) => {
	const shikiLines = await highlightCode({ code, language });

	return (
		<div
			className={classNames(
				styles.wrapper,
				numberOfLines && styles.withLineNumbers,
				className,
			)}
		>
			{numberOfLines && (
				<pre
					className={styles.lineNumbers}
					aria-hidden="true"
				>
					{Array.from({ length: numberOfLines }, (_, index) => index + 1).join(
						'\n',
					)}
				</pre>
			)}
			<pre
				className={styles.code}
				aria-label={ariaLabel}
			>
				<code>
					{shikiLines.map((line, index) => (
						<span key={JSON.stringify(line) + index}>
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
					))}
				</code>
			</pre>
		</div>
	);
};
