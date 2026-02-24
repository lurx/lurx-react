import { Fira_Code } from 'next/font/google';
import './styles/global.scss';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { PropsWithChildren } from 'react';
import { Navbar, SocialBar } from '../layout/';
import { BorderLines } from './components/entry-animation/border-lines.component';
import { EntryAnimation } from './components/entry-animation/entry-animation.component';
import { EntryAnimationProvider } from './components/entry-animation/entry-animation.context';
import { ReplayButton } from './components/entry-animation/replay-button.component';
import styles from './page.module.scss';
config.autoAddCss = false;

const firaCode = Fira_Code({
	subsets: ['latin'],
	weight: ['400', '600', '700'],
	variable: '--font-mono',
});

export default function MainLayout({ children }: PropsWithChildren) {
	return (
		<div className={`${firaCode.variable} ${firaCode.className}`}>
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
			<div id="portal-root" />
		</div>
	);
}
