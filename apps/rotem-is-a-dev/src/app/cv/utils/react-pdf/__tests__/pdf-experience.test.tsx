import { render, screen } from '@testing-library/react';

jest.mock('@react-pdf/renderer', () => require('../__mocks__/react-pdf-mock'));
jest.mock('@/app/cv/sections/experience/experience.helpers', () => ({
	sortByEndDate: (jobs: ExperienceItem[]) => jobs,
}));
jest.mock('@/app/cv/sections/intro/intro.helpers', () => ({
	calculateYearsOfExperience: jest.fn(() => 10),
}));

import { PdfExperience } from '../components/pdf-experience.component';
import { PdfExperienceItem } from '../components/pdf-experience-item.component';

const mockJobs: ExperienceItem[] = [
	{
		company: 'Acme Corp',
		position: 'Senior Developer',
		duration: { start: 2020, end: 'Present' },
		description: 'Building products.',
		achievements: ['Led frontend team', 'Built design system'],
	},
	{
		company: 'Startup Inc',
		position: 'Developer',
		duration: { start: 2018, end: 2020 },
		description: 'Web development.',
		achievements: ['Shipped 5 features'],
	},
];

describe('PdfExperience', () => {
	it('renders the Experience section title', () => {
		render(<PdfExperience workExperience={mockJobs} />);
		expect(screen.getByText('Experience')).toBeInTheDocument();
	});

	it('renders all job positions', () => {
		render(<PdfExperience workExperience={mockJobs} />);
		expect(screen.getByText('Senior Developer')).toBeInTheDocument();
		expect(screen.getByText('Developer')).toBeInTheDocument();
	});
});

describe('PdfExperienceItem', () => {
	const singleJob = mockJobs[0];

	it('renders the position', () => {
		render(<PdfExperienceItem item={singleJob} isLast={false} />);
		expect(screen.getByText('Senior Developer')).toBeInTheDocument();
	});

	it('renders company and duration', () => {
		render(<PdfExperienceItem item={singleJob} isLast={false} />);
		expect(screen.getByText(/Acme Corp/)).toBeInTheDocument();
		expect(screen.getByText(/2020 - Present/)).toBeInTheDocument();
	});

	it('renders the description', () => {
		render(<PdfExperienceItem item={singleJob} isLast={false} />);
		expect(screen.getByText('Building products.')).toBeInTheDocument();
	});

	it('renders achievements', () => {
		render(<PdfExperienceItem item={singleJob} isLast={false} />);
		expect(screen.getByText('Led frontend team')).toBeInTheDocument();
		expect(screen.getByText('Built design system')).toBeInTheDocument();
	});

	it('renders without description when not provided', () => {
		const jobNoDesc: ExperienceItem = {
			company: 'NoDesc',
			position: 'Tester',
			duration: { start: 2015, end: 2018 },
		};
		render(<PdfExperienceItem item={jobNoDesc} isLast={true} />);
		expect(screen.getByText('Tester')).toBeInTheDocument();
	});
});
