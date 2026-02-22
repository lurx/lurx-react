import './styles/global.scss';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { DownloadPdfButton } from './components/download-pdf-button';
import type { PropsWithChildren } from 'react';
config.autoAddCss = false;

export const metadata = {
	title: 'Rotem Horovitz — CV',
};

export default function CvLayout({
	children,
}: PropsWithChildren) {
	return (
		<>
			<DownloadPdfButton />
			{children}
		</>
	);
}
