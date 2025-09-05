import type { PropsWithChildren } from 'react';
import { AppProvider } from './context/app-context';
import { pressStart2P } from './fonts';
import './globals.scss';
import { InnerLayout } from './layout/inner-layout';

export const metadata = {
	title: 'Rotem is a Dev',
	description: 'Site under construction (but pixel perfect)',
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body className={pressStart2P.className}>
				<AppProvider>
					<InnerLayout>{children}</InnerLayout>
				</AppProvider>
			</body>
		</html>
	);
}
