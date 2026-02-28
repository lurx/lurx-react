import type { PropsWithChildren } from 'react';
import styles from './link.module.scss';

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
	href: string;
}

const externalIndicators = ['http://', 'https://', 'mailto:'];

export const Link = ({ href, children }: PropsWithChildren<LinkProps>) => {
	const isExternal = externalIndicators.some(indicator =>
		href.startsWith(indicator),
	);

	const externalAttributes = isExternal
		? { target: '_blank', rel: 'noopener noreferrer' }
		: {};

	return (
		<a
			href={href}
			className={styles.link}
			{...externalAttributes}
		>
			{children}
		</a>
	);
};
