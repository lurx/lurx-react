import * as React from 'react';

export default function NextLink({
	href,
	children,
	...props
}: { href: string; children?: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
	return (
		<a href={href} {...props}>
			{children}
		</a>
	);
}
