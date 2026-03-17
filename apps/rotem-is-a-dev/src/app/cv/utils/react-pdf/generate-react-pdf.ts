import { pdf } from '@react-pdf/renderer';
import { CvDocument } from './cv-document.component';

export const generateReactPdf = async (): Promise<void> => {
	const blob = await pdf(CvDocument({})).toBlob();
	const url = URL.createObjectURL(blob);

	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = 'rotem-horovitz-cv.pdf';
	document.body.appendChild(anchor);
	anchor.click();

	document.body.removeChild(anchor);
	URL.revokeObjectURL(url);
};
