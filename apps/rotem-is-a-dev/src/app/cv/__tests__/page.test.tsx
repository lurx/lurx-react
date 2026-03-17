jest.mock('../components/pdf-preview', () => ({
	PdfPreview: () => <div data-testid="pdf-preview" />,
}));

import { render, screen } from '@testing-library/react';
import CV from '../page';

describe('CV page', () => {
	it('renders the PDF preview', () => {
		render(<CV />);

		expect(screen.getByTestId('pdf-preview')).toBeInTheDocument();
	});
});
