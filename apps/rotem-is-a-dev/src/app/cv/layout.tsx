import { ThemeProvider } from './context/theme.context';
import './styles/global.scss';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { AppHeader } from './components/app-header';
config.autoAddCss = false;

export const metadata = {
	title: 'Rotem Horovitz — CV',
};

const noFlashScript = `(function(){var t=localStorage.getItem('theme')||((window.matchMedia('(prefers-color-scheme: light)').matches)?'light':'dark');if(t==='light')document.documentElement.setAttribute('data-theme','light');})();`;

export default function CvLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
			<ThemeProvider>
				<AppHeader />
				{children}
			</ThemeProvider>
		</>
	);
}
