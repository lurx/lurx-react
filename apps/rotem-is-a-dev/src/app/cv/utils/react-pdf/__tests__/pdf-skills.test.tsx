import { render, screen } from '@testing-library/react';

jest.mock('@react-pdf/renderer', () => require('../__mocks__/react-pdf-mock'));

import { PdfSkills } from '../components/pdf-skills.component';

const mockSkills: SkillObject[] = [
	{ name: 'react', iconName: 'react', iconGroup: 'fab', level: 10 },
	{ name: 'css', iconName: 'css', iconGroup: 'fab', level: 8 },
];

describe('PdfSkills', () => {
	it('renders the Skills section title', () => {
		render(<PdfSkills skills={mockSkills} />);
		expect(screen.getByText('Skills')).toBeInTheDocument();
	});

	it('renders all skill names', () => {
		render(<PdfSkills skills={mockSkills} />);
		expect(screen.getByText('react')).toBeInTheDocument();
		expect(screen.getByText('css')).toBeInTheDocument();
	});
});
