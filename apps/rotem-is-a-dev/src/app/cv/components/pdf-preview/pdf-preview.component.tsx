'use client';

export const PdfPreview = () => (
	<iframe
		src="/api/cv-pdf"
		width="100%"
		height="100%"
		title="CV Preview"
	/>
);
