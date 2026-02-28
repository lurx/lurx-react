import { highlightCode } from '@/lib/shiki/highlight-code';
import classNames from 'classnames';
import { ShikiCode } from '../shiki-code';
import styles from './code-block.module.scss';
import type { ServerCodeBlockProps } from './code-block.types';

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
					<ShikiCode lines={shikiLines} />
				</code>
			</pre>
		</div>
	);
};
