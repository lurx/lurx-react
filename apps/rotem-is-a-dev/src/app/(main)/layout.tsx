import { Fira_Code } from 'next/font/google';
import './styles/global.scss';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { PropsWithChildren } from 'react';
import { Navbar, SocialBar } from '../layout/';
import styles from './page.module.scss';
config.autoAddCss = false;

const firaCode = Fira_Code({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	variable: '--font-mono',
});

export default function MainLayout({ children }: PropsWithChildren) {
	return (
		<div className={`${firaCode.variable} ${firaCode.className}`}>
			<div className={styles.backdrop}>
				<main className={styles.page}>
					<Navbar />
					{children}
					<SocialBar />
				</main>
			</div>
		</div>
	);
}
