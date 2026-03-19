import { render, screen } from '@testing-library/react';

jest.mock('@react-pdf/renderer', () => require('../__mocks__/react-pdf-mock'));

import { PdfSectionTitle } from '../components/pdf-section-title.component';

describe('PdfSectionTitle', () => {
	it('renders the title text', () => {
		render(<PdfSectionTitle title="Experience" />);
		expect(screen.getByText('Experience')).toBeInTheDocument();
	});
});
