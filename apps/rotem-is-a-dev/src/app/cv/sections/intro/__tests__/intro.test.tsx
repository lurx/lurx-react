import { render, screen } from '@testing-library/react';
import { useCV } from '@/app/cv/context/cv.context';

jest.mock('@/app/cv/context/cv.context', () => ({
	useCV: jest.fn(),
}));

const mockCalculateYearsOfExperience = jest.fn();

jest.mock('../intro.helpers', () => ({
	calculateYearsOfExperience: (...args: unknown[]) =>
		mockCalculateYearsOfExperience(...args),
}));

const mockUseCV = jest.mocked(useCV);

const mockWorkExperience: ExperienceItem[] = [
	{
		company: 'Acme',
		position: 'Dev',
		duration: { start: 2018, end: 'Present' },
	},
];

beforeEach(() => {
	mockCalculateYearsOfExperience.mockReturnValue(5);
	mockUseCV.mockReturnValue({
		name: 'Test',
		titles: [],
		intro: 'I have %numYears% years of experience.',
		contact: {
			email: '',
			phone: '',
			social: { linkedin: '', github: '' },
		},
		work_experience: mockWorkExperience,
		skills: [],
		languages: [],
	});
});

import { Intro } from '../intro.component';

describe('Intro', () => {
	it('renders the intro paragraph with years substituted', () => {
		render(<Intro />);
		expect(screen.getByText('I have 5 years of experience.')).toBeInTheDocument();
	});

	it('calls calculateYearsOfExperience with work_experience', () => {
		render(<Intro />);
		expect(mockCalculateYearsOfExperience).toHaveBeenCalledWith(mockWorkExperience);
	});

	it('renders a paragraph element', () => {
		render(<Intro />);
		expect(screen.getByText('I have 5 years of experience.').tagName).toBe('P');
	});

	it('replaces %numYears% placeholder with the calculated number', () => {
		mockCalculateYearsOfExperience.mockReturnValueOnce(8);
		render(<Intro />);
		expect(screen.getByText('I have 8 years of experience.')).toBeInTheDocument();
	});

	it('renders intro text without placeholder when no %numYears% token exists', () => {
		mockUseCV.mockReturnValueOnce({
			name: 'Test',
			titles: [],
			intro: 'Static intro text.',
			contact: {
				email: '',
				phone: '',
				social: { linkedin: '', github: '' },
			},
			work_experience: mockWorkExperience,
			skills: [],
			languages: [],
		});
		render(<Intro />);
		expect(screen.getByText('Static intro text.')).toBeInTheDocument();
	});
});
