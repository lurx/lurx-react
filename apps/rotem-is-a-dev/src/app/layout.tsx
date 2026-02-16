import { ThemeProvider } from '@/app/context/theme.context';
import './styles/global.scss';


import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { AppHeader } from './components/app-header';
config.autoAddCss = false

export const metadata = {
	title: 'Rotem Horovitz',
};

const noFlashScript = `(function(){var t=localStorage.getItem('theme')||((window.matchMedia('(prefers-color-scheme: light)').matches)?'light':'dark');if(t==='light')document.documentElement.setAttribute('data-theme','light');})();`;

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
			</head>
			<body>
				<ThemeProvider>
          <AppHeader />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
