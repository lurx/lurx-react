import { pdf } from '@react-pdf/renderer';
import { CvDocument } from './cv-document.component';
import { PDF_FILE_NAME } from './cv-document.constants';

export const generateReactPdf = async (): Promise<void> => {
	const blob = await pdf(CvDocument({})).toBlob();
	const url = URL.createObjectURL(blob);

	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = PDF_FILE_NAME;
	document.body.appendChild(anchor);
	anchor.click();

	anchor.remove();
	URL.revokeObjectURL(url);
};
