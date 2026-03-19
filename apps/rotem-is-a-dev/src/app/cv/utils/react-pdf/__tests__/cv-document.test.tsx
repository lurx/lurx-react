import { render, screen } from '@testing-library/react';

jest.mock('@react-pdf/renderer', () => require('../__mocks__/react-pdf-mock'));
jest.mock('@/app/cv/sections/intro/intro.helpers', () => ({
	calculateYearsOfExperience: jest.fn(() => 15),
}));
jest.mock('@/app/cv/sections/experience/experience.helpers', () => ({
	sortByEndDate: (jobs: ExperienceItem[]) => jobs,
}));
jest.mock('@/data/cv.data', () => ({
	__esModule: true,
	default: {
		name: 'Test User',
		titles: ['Developer'],
		intro: '%numYears% years of experience.',
		contact: {
			email: 'test@example.com',
			phone: '+1234567890',
			website: 'https://test.com',
			social: {
				linkedin: 'https://linkedin.com/in/testuser',
				github: 'https://github.com/testuser',
			},
		},
		work_experience: [
			{
				company: 'TestCo',
				position: 'Engineer',
				duration: { start: 2020, end: 'Present' },
				description: 'Test work.',
				achievements: ['Achievement 1'],
			},
		],
		skills: [{ name: 'react', iconName: 'react', iconGroup: 'fab', level: 10 }],
		languages: ['English'],
	},
}));

import { CvDocument } from '../cv-document.component';

describe('CvDocument', () => {
	describe('with default data', () => {
		beforeEach(() => {
			render(<CvDocument />);
		});

		it('renders the name', () => {
			expect(screen.getByText('Test User')).toBeInTheDocument();
		});

		it('renders intro with resolved years', () => {
			expect(screen.getByText('15 years of experience.')).toBeInTheDocument();
		});

		it('renders experience section', () => {
			expect(screen.getByText('Experience')).toBeInTheDocument();
			expect(screen.getByText('Engineer')).toBeInTheDocument();
		});

		it('renders skills section', () => {
			expect(screen.getByText('Skills')).toBeInTheDocument();
			expect(screen.getByText('react')).toBeInTheDocument();
		});

		it('renders languages section', () => {
			expect(screen.getByText('Languages')).toBeInTheDocument();
			expect(screen.getByText('English')).toBeInTheDocument();
		});
	});

	it('accepts custom data via props', () => {
		const customData = {
			name: 'Custom Name',
			titles: ['Custom Title'],
			intro: 'Custom intro with %numYears% years.',
			contact: {
				email: 'custom@example.com',
				phone: '+0000000000',
				website: 'https://custom.com',
				social: {
					linkedin: 'https://linkedin.com/in/custom',
					github: 'https://github.com/custom',
				},
			},
			work_experience: [],
			skills: [],
			languages: ['French'],
		};

		render(<CvDocument data={customData} />);
		expect(screen.getByText('Custom Name')).toBeInTheDocument();
		expect(screen.getByText('French')).toBeInTheDocument();
	});
});
