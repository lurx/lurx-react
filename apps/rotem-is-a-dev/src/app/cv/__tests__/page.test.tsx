jest.mock('../components/pdf-preview', () => ({
	PdfPreview: () => <div data-testid="pdf-preview" />,
}));

import { render, screen } from '@testing-library/react';
import CvPage from '../page';

describe('CV page', () => {
	it('renders the PDF preview', () => {
		render(<CvPage />);

		expect(screen.getByTestId('pdf-preview')).toBeInTheDocument();
	});
});
