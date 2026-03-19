import { render, screen } from '@testing-library/react';

jest.mock('@react-pdf/renderer', () => require('../__mocks__/react-pdf-mock'));

import { PdfLanguages } from '../components/pdf-languages.component';

describe('PdfLanguages', () => {
	it('renders the Languages section title', () => {
		render(<PdfLanguages languages={['English', 'Hebrew']} />);
		expect(screen.getByText('Languages')).toBeInTheDocument();
	});

	it('renders all languages', () => {
		render(<PdfLanguages languages={['English (Fluent)', 'Hebrew (Native)']} />);
		expect(screen.getByText('English (Fluent)')).toBeInTheDocument();
		expect(screen.getByText('Hebrew (Native)')).toBeInTheDocument();
	});
});
