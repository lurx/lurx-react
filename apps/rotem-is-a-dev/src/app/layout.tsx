import type { PropsWithChildren } from 'react';
import { AppProvider } from './context/app-context';
import { firaCode, inter, poppins } from './fonts';
import './globals.scss';
import { InnerLayout } from './layout/inner-layout';

export const metadata = {
	title: 'Rotem is a Dev',
	description: 'Site under construction (but pixel perfect)',
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body className={`${inter.variable} ${poppins.variable} ${firaCode.variable}`}>
				<AppProvider>
					<InnerLayout>{children}</InnerLayout>
				</AppProvider>
			</body>
		</html>
	);
}
