import { PropsWithChildren } from 'react';
import styles from './punctuation.module.scss';
import cn from 'classnames';

const noSpacingChars = [
	"'",
	'"',
	'”',
	'“',
	'`',
	'‘',
	'’',
  '-',
];

export const Punctuation = ({ children }: PropsWithChildren) => {
	if (typeof children !== 'string') {
		return null;
	}

	const shouldHaveSpacing = !noSpacingChars.includes(children);

	console.log({ children, shouldHaveSpacing });

	return (
		<span
			className={cn(styles.punctuation, {
				[styles.noSpacing]: !shouldHaveSpacing,
			})}
		>
			{children}
		</span>
	);
};
