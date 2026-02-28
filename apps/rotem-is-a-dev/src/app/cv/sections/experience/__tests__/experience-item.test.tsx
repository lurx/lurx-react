import { render, screen } from '@testing-library/react';
import { ExperienceItem } from '../experience-item.component';

const baseJob: ExperienceItem = {
	company: 'Acme Corp',
	position: 'Frontend Developer',
	duration: { start: 2020, end: 2023 },
	description: 'Built great things.',
};

describe('ExperienceItem', () => {
	it('renders the job position', () => {
		render(<ExperienceItem job={baseJob} />);
		expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
	});

	it('renders the company name', () => {
		render(<ExperienceItem job={baseJob} />);
		expect(screen.getByText(/Acme Corp/)).toBeInTheDocument();
	});

	it('renders the duration start and end years', () => {
		render(<ExperienceItem job={baseJob} />);
		expect(screen.getByText(/2020/)).toBeInTheDocument();
		expect(screen.getByText(/2023/)).toBeInTheDocument();
	});

	it('renders the description', () => {
		render(<ExperienceItem job={baseJob} />);
		expect(screen.getByText('Built great things.')).toBeInTheDocument();
	});

	it('renders achievements when provided', () => {
		const jobWithAchievements: ExperienceItem = {
			...baseJob,
			achievements: ['Shipped feature A', 'Reduced bundle size by 30%'],
		};
		render(<ExperienceItem job={jobWithAchievements} />);
		expect(screen.getByText('Shipped feature A')).toBeInTheDocument();
		expect(screen.getByText('Reduced bundle size by 30%')).toBeInTheDocument();
	});

	it('does not render a list when achievements are not provided', () => {
		render(<ExperienceItem job={baseJob} />);
		expect(screen.queryByRole('list')).not.toBeInTheDocument();
	});

	it('renders an empty list when achievements is an empty array', () => {
		const jobWithEmptyAchievements: ExperienceItem = {
			...baseJob,
			achievements: [],
		};
		render(<ExperienceItem job={jobWithEmptyAchievements} />);
		expect(screen.getByRole('list')).toBeInTheDocument();
		expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
	});

	it('renders "Present" as end date when job is current', () => {
		const currentJob: ExperienceItem = {
			...baseJob,
			duration: { start: 2021, end: 'Present' },
		};
		render(<ExperienceItem job={currentJob} />);
		expect(screen.getByText(/Present/)).toBeInTheDocument();
	});

	it('renders a list item for each achievement', () => {
		const jobWithAchievements: ExperienceItem = {
			...baseJob,
			achievements: ['Achievement one', 'Achievement two', 'Achievement three'],
		};
		render(<ExperienceItem job={jobWithAchievements} />);
		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(3);
	});
});
