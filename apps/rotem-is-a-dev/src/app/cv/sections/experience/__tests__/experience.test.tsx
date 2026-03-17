import { render, screen } from '@testing-library/react';
import { useCV } from '@/app/cv/context/cv.context';

jest.mock('@/app/cv/context/cv.context', () => ({
	useCV: jest.fn(),
}));

jest.mock('@/app/cv/components', () => ({
	Card: ({ children, id }: { children: React.ReactNode; id?: string }) => (
		<div id={id}>{children}</div>
	),
}));

jest.mock('@/app/components', () => ({
	Flex: ({
		children,
		direction,
		gap,
	}: {
		children: React.ReactNode;
		direction?: string;
		gap?: string;
	}) => <div data-direction={direction} data-gap={gap}>{children}</div>,
}));

const mockSortByEndDate = jest.fn((jobs: ExperienceItem[]) => jobs);

jest.mock('../experience.helpers', () => ({
	sortByEndDate: (...args: unknown[]) => mockSortByEndDate(...args as [ExperienceItem[]]),
}));

jest.mock('../experience-item.component', () => ({
	ExperienceItem: ({ job }: { job: ExperienceItem }) => (
		<div data-testid="experience-item">{job.position}</div>
	),
}));

const mockUseCV = jest.mocked(useCV);

const mockJobs: ExperienceItem[] = [
	{
		company: 'Company A',
		position: 'Engineer',
		duration: { start: 2019, end: 2021 },
		description: 'Did engineering.',
	},
	{
		company: 'Company B',
		position: 'Senior Engineer',
		duration: { start: 2021, end: 'Present' },
		description: 'Doing senior engineering.',
	},
];

beforeEach(() => {
	mockSortByEndDate.mockClear();
	mockSortByEndDate.mockImplementation((jobs: ExperienceItem[]) => jobs);
	mockUseCV.mockReturnValue({
		name: 'Test User',
		titles: [],
		intro: '',
		contact: {
			email: '',
			phone: '',
			website: '',
			social: { linkedin: '', github: '' },
		},
		work_experience: mockJobs,
		skills: [],
		languages: [],
	});
});

import { Experience } from '../experience.component';

describe('Experience', () => {
	it('renders the Experience heading', () => {
		render(<Experience />);
		expect(screen.getByText('Experience')).toBeInTheDocument();
	});

	it('renders the Card with id "work_experience"', () => {
		render(<Experience />);
		expect(document.getElementById('work_experience')).toBeInTheDocument();
	});

	it('renders an ExperienceItem for each job', () => {
		render(<Experience />);
		const items = screen.getAllByTestId('experience-item');
		expect(items).toHaveLength(2);
	});

	it('renders job positions inside ExperienceItem components', () => {
		render(<Experience />);
		expect(screen.getByText('Engineer')).toBeInTheDocument();
		expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
	});

	it('calls sortByEndDate with work_experience from context', () => {
		render(<Experience />);
		expect(mockSortByEndDate).toHaveBeenCalledWith(mockJobs);
	});

	it('renders sorted jobs returned by sortByEndDate', () => {
		const reversed = [...mockJobs].reverse();
		mockSortByEndDate.mockReturnValueOnce(reversed);

		render(<Experience />);
		const items = screen.getAllByTestId('experience-item');
		expect(items[0]).toHaveTextContent('Senior Engineer');
		expect(items[1]).toHaveTextContent('Engineer');
	});

	it('renders no items when work_experience is empty', () => {
		mockUseCV.mockReturnValueOnce({
			name: 'Test User',
			titles: [],
			intro: '',
			contact: {
				email: '',
				phone: '',
				website: '',
				social: { linkedin: '', github: '' },
			},
			work_experience: [],
			skills: [],
			languages: [],
		});
		mockSortByEndDate.mockReturnValueOnce([]);
		render(<Experience />);
		expect(screen.queryByTestId('experience-item')).not.toBeInTheDocument();
	});
});
