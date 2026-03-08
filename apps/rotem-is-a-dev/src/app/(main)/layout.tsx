import { Fira_Code } from 'next/font/google';
import './styles/global.scss';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { PropsWithChildren } from 'react';
import { AuthProvider } from '../context/auth';
import { Navbar, SocialBar } from '../layout/';
import { BorderLines, EntryAnimation, EntryAnimationProvider, ReplayButton } from './components/entry-animation';
import styles from './page.module.scss';
config.autoAddCss = false;

const firaCode = Fira_Code({
	subsets: ['latin'],
	weight: ['400', '600', '700'],
	variable: '--font-mono',
});

export default function MainLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<div className={`${firaCode.variable} ${firaCode.className}`}>
			<AuthProvider>
				<EntryAnimationProvider>
					<div className={styles.backdrop}>
						<main className={styles.page} data-page>
							<EntryAnimation />
							<BorderLines />
							<Navbar />
							{children}
							<SocialBar />
						</main>
					</div>
					<ReplayButton />
				</EntryAnimationProvider>
			</AuthProvider>
			<div id="portal-root" />
		</div>
	);
}
