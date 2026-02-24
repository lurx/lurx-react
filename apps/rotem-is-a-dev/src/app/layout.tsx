import accessibilityScript from '@/lib/accessibility-script.ts?raw';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

export const metadata: Metadata = {
	metadataBase: new URL('https://rotem.is-a.dev'),
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
		<html lang="en">
			<head>
				<script dangerouslySetInnerHTML={{ __html: accessibilityScript }} />
			</head>
			<body>{children}</body>
		</html>
	);
}
