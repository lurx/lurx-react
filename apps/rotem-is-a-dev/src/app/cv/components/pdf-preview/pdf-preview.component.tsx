'use client';

import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';

export const PdfPreview = () => {
	const [viewer, setViewer] = useState<ReactElement | null>(null);

	useEffect(() => {
		const loadViewer = async () => {
			const { PDFViewer } = await import('@react-pdf/renderer');
			const { CvDocument } = await import('@/app/cv/utils/react-pdf/cv-document.component');

			setViewer(
				<PDFViewer width="100%" height="100%" showToolbar>
					<CvDocument />
				</PDFViewer>,
			);
		};

		loadViewer();
	}, []);

	if (!viewer) {
		return null;
	}

	return viewer;
};
