import { renderToBuffer } from '@react-pdf/renderer';
import { CvDocument } from '@/app/cv/utils/react-pdf/cv-document.component';
import { PDF_FILE_NAME } from '@/app/cv/utils/react-pdf/cv-document.constants';

export async function GET() {
	const buffer = await renderToBuffer(CvDocument({}));

	return new Response(new Uint8Array(buffer), {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `inline; filename="${PDF_FILE_NAME}"`,
		},
	});
}
