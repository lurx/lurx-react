'use client';

import { PDFViewer } from '@react-pdf/renderer';
import { CvDocument } from '@/app/cv/utils/react-pdf/cv-document.component';

export const PdfPreview = () => (
	<PDFViewer
		width="100%"
		height="100%"
		showToolbar
	>
		<CvDocument />
	</PDFViewer>
);
