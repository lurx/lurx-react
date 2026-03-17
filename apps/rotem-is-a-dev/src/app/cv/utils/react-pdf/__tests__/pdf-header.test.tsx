import { render, screen } from '@testing-library/react';

jest.mock('@react-pdf/renderer', () => require('../__mocks__/react-pdf-mock'));

import { PdfHeader } from '../components/pdf-header.component';

const defaultProps = {
	name: 'John Doe',
	titles: ['Developer', 'Designer'],
	contact: {
		email: 'john@example.com',
		phone: '+1234567890',
		website: 'https://johndoe.com',
		social: {
			linkedin: 'https://linkedin.com/in/johndoe',
			github: 'https://github.com/johndoe',
		},
	},
	introText: 'A passionate developer with many years of experience.',
};

describe('PdfHeader', () => {
	it('renders the name', () => {
		render(<PdfHeader {...defaultProps} />);
		expect(screen.getByText('John Doe')).toBeInTheDocument();
	});

	it('renders titles joined with pipe', () => {
		render(<PdfHeader {...defaultProps} />);
		expect(screen.getByText('Developer | Designer')).toBeInTheDocument();
	});

	it('renders the email', () => {
		render(<PdfHeader {...defaultProps} />);
		expect(screen.getByText('john@example.com')).toBeInTheDocument();
	});

	it('renders the phone number', () => {
		render(<PdfHeader {...defaultProps} />);
		expect(screen.getByText('+1234567890')).toBeInTheDocument();
	});

	it('renders website without https://', () => {
		render(<PdfHeader {...defaultProps} />);
		expect(screen.getByText('johndoe.com')).toBeInTheDocument();
	});

	it('renders LinkedIn without https://', () => {
		render(<PdfHeader {...defaultProps} />);
		expect(screen.getByText('linkedin.com/in/johndoe')).toBeInTheDocument();
	});

	it('renders the intro text', () => {
		render(<PdfHeader {...defaultProps} />);
		expect(screen.getByText(defaultProps.introText)).toBeInTheDocument();
	});
});
