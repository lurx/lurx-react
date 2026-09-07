import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { ThemeInitScript } from './layout/theme-init-script';

export const metadata: Metadata = {
	metadataBase: new URL('https://rotemhorovitz.com'),
	title: {
		template: '%s | Rotem Horovitz',
		default: 'Rotem Horovitz — Senior Frontend Developer',
	},
	description:
		'Portfolio of Rotem Horovitz, a Senior Frontend Developer specializing in React, TypeScript, and modern web technologies.',
	openGraph: {
		siteName: 'Rotem Horovitz',
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
	},
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		// ThemeInitScript writes data-theme onto <html> before hydration, so the
		// server markup intentionally differs from the first client render here.
		<html
			lang="en"
			suppressHydrationWarning
		>
			<head>
				<ThemeInitScript />
			</head>
			<body>{children}</body>
		</html>
	);
}
