import { render, screen } from '@testing-library/react';
import { PdfPreview } from '../pdf-preview.component';

describe('PdfPreview', () => {
	it('renders an iframe pointing to the PDF API route', () => {
		render(<PdfPreview />);

		const iframe = screen.getByTitle('CV Preview');

		expect(iframe).toBeInTheDocument();
		expect(iframe.tagName).toBe('IFRAME');
		expect(iframe).toHaveAttribute('src', '/api/cv-pdf');
	});

	it('renders the iframe at full width and height', () => {
		render(<PdfPreview />);

		const iframe = screen.getByTitle('CV Preview');

		expect(iframe).toHaveAttribute('width', '100%');
		expect(iframe).toHaveAttribute('height', '100%');
	});
});
