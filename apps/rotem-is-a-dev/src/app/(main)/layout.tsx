import { Bitcount_Grid_Single, Fira_Code } from 'next/font/google';
import './styles/global.scss';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { PropsWithChildren } from 'react';
import { Navbar, SocialBar } from '../layout/';
import { ThemeProvider } from '../layout/theme';
import { BorderLines } from './components/border-lines';
import styles from './page.module.scss';
config.autoAddCss = false;

const firaCode = Fira_Code({
	subsets: ['latin'],
	weight: ['400', '600', '700'],
	variable: '--font-mono',
});

const bitcountGridSingle = Bitcount_Grid_Single({
	subsets: ['latin'],
	weight: ['400'],
	variable: '--font-game',
});

export default function MainLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<ThemeProvider>
			<div className={`${firaCode.variable} ${bitcountGridSingle.variable} ${firaCode.className}`}>
				<div className={styles.backdrop}>
					<main className={styles.page} data-page>
						<BorderLines />
						<Navbar />
						{children}
						<SocialBar />
					</main>
				</div>
				<div id="portal-root" />
			</div>
		</ThemeProvider>
	);
}
