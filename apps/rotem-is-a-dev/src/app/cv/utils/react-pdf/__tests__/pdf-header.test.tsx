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

beforeEach(() => {
	render(<PdfHeader {...defaultProps} />);
});

describe('PdfHeader', () => {
	it('renders the name', () => {
		expect(screen.getByText('John Doe')).toBeInTheDocument();
	});

	it('renders titles joined with pipe', () => {
		expect(screen.getByText('Developer | Designer')).toBeInTheDocument();
	});

	it('renders the email', () => {
		expect(screen.getByText('john@example.com')).toBeInTheDocument();
	});

	it('renders the phone number', () => {
		expect(screen.getByText('+1234567890')).toBeInTheDocument();
	});

	it('renders website without https://', () => {
		expect(screen.getByText('johndoe.com')).toBeInTheDocument();
	});

	it('renders LinkedIn without https://', () => {
		expect(screen.getByText('linkedin.com/in/johndoe')).toBeInTheDocument();
	});

	it('renders the intro text', () => {
		expect(screen.getByText(defaultProps.introText)).toBeInTheDocument();
	});
});
