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
	}: {
		children: React.ReactNode;
		direction?: string;
	}) => <div data-direction={direction}>{children}</div>,
}));

jest.mock('../../contact', () => ({
	Contact: () => <div data-testid="contact" />,
}));

jest.mock('../../intro', () => ({
	Intro: () => <div data-testid="intro" />,
}));

const mockUseCV = jest.mocked(useCV);

beforeEach(() => {
	mockUseCV.mockReturnValue({
		name: 'Rotem Horovitz',
		titles: ['Frontend Developer', 'React Expert'],
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
});

import { Header } from '../header.component';

describe('Header', () => {
	it('renders the name from context', () => {
		render(<Header />);
		expect(screen.getByText('Rotem Horovitz')).toBeInTheDocument();
	});

	it('renders joined titles separated by " | "', () => {
		render(<Header />);
		expect(screen.getByText('Frontend Developer | React Expert')).toBeInTheDocument();
	});

	it('renders a single title without separator', () => {
		mockUseCV.mockReturnValueOnce({
			name: 'Rotem Horovitz',
			titles: ['Frontend Developer'],
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
		render(<Header />);
		expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
	});

	it('renders the Card with id "about"', () => {
		render(<Header />);
		expect(document.getElementById('about')).toBeInTheDocument();
	});

	it('renders the Contact component', () => {
		render(<Header />);
		expect(screen.getByTestId('contact')).toBeInTheDocument();
	});

	it('renders the Intro component', () => {
		render(<Header />);
		expect(screen.getByTestId('intro')).toBeInTheDocument();
	});

	it('renders the name as an h1', () => {
		render(<Header />);
		expect(screen.getByRole('heading', { level: 1, name: 'Rotem Horovitz' })).toBeInTheDocument();
	});

	it('renders the title string as an h2', () => {
		render(<Header />);
		expect(
			screen.getByRole('heading', { level: 2, name: 'Frontend Developer | React Expert' }),
		).toBeInTheDocument();
	});
});
