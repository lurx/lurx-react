import { render, screen } from '@testing-library/react';
import { useCV } from '@/app/cv/context/cv.context';

jest.mock('@/app/cv/context/cv.context', () => ({
	useCV: jest.fn(),
}));

jest.mock('@/app/components', () => ({
	FaIcon: ({
		iconName,
		iconGroup,
	}: {
		iconName: string;
		iconGroup?: string;
	}) => (
		<span data-testid="fa-icon" data-icon-name={iconName} data-icon-group={iconGroup} />
	),
	Flex: ({
		children,
		direction,
		id,
		className,
		gap,
		align,
		justify,
	}: {
		children: React.ReactNode;
		direction?: string;
		id?: string;
		className?: string;
		gap?: string;
		align?: string;
		justify?: string;
	}) => (
		<div
			id={id}
			className={className}
			data-direction={direction}
			data-gap={gap}
			data-align={align}
			data-justify={justify}
		>
			{children}
		</div>
	),
}));

const mockUseCV = jest.mocked(useCV);

const mockSkills: SkillObject[] = [
	{ name: 'react', level: 9, iconName: 'react', iconGroup: 'fab' },
	{ name: 'typescript', level: 8, iconName: 'typescript', iconGroup: 'fas' },
	{ name: 'unknown-skill', level: 5, iconGroup: 'fas' } as SkillObject,
];

beforeEach(() => {
	mockUseCV.mockReturnValue({
		name: '',
		titles: [],
		intro: '',
		contact: {
			email: '',
			phone: '',
			website: '',
			social: { linkedin: '', github: '' },
		},
		work_experience: [],
		skills: mockSkills,
		languages: [],
	});
});

import { Skills } from '../skills.component';

describe('Skills', () => {
	it('renders the Skills heading', () => {
		render(<Skills />);
		expect(screen.getByText('Skills')).toBeInTheDocument();
	});

	it('renders with id "skills"', () => {
		render(<Skills />);
		expect(document.getElementById('skills')).toBeInTheDocument();
	});

	it('renders a tag for each skill', () => {
		render(<Skills />);
		expect(screen.getByText('react')).toBeInTheDocument();
		expect(screen.getByText('typescript')).toBeInTheDocument();
		expect(screen.getByText('unknown-skill')).toBeInTheDocument();
	});

	it('renders an FaIcon for each skill', () => {
		render(<Skills />);
		const icons = screen.getAllByTestId('fa-icon');
		expect(icons).toHaveLength(mockSkills.length);
	});

	it('uses the skill iconName when provided', () => {
		render(<Skills />);
		const icons = screen.getAllByTestId('fa-icon');
		const reactIcon = icons.find(icon => (icon as HTMLElement).dataset.iconName === 'react');
		expect(reactIcon).toBeInTheDocument();
	});

	it('falls back to "code" icon when iconName is not provided', () => {
		render(<Skills />);
		const icons = screen.getAllByTestId('fa-icon');
		const codeIcon = icons.find(icon => (icon as HTMLElement).dataset.iconName === 'code');
		expect(codeIcon).toBeInTheDocument();
	});

	it('applies the brand color for known skills via CSS custom property', () => {
		const { container } = render(<Skills />);
		const reactTag = container.querySelector('[style*="--skill-progress-color"]') as HTMLElement;
		expect(reactTag).toBeInTheDocument();
	});

	it('applies the default brand color for unknown skills', () => {
		const { container } = render(<Skills />);
		const tags = container.querySelectorAll<HTMLElement>('[style*="--skill-progress-color"]');
		const unknownTag = Array.from(tags).find(tag => tag.textContent?.includes('unknown-skill'));
		expect(unknownTag?.style.getPropertyValue('--skill-progress-color')).toBe('#646cff');
	});

	it('applies a fill width based on skill level', () => {
		const { container } = render(<Skills />);
		const fills = container.querySelectorAll<HTMLElement>('[style*="width"]');
		const reactFill = Array.from(fills).find(
			fill => fill.style.width === `${(9 / 10) * 100}%`,
		);
		expect(reactFill).toBeInTheDocument();
	});

	it('renders no skill tags when skills array is empty', () => {
		mockUseCV.mockReturnValueOnce({
			name: '',
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
		render(<Skills />);
		expect(screen.queryByTestId('fa-icon')).not.toBeInTheDocument();
	});
});
