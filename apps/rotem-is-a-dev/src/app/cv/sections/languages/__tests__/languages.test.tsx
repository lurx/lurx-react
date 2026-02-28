import { render, screen } from '@testing-library/react';
import { useCV } from '@/app/cv/context/cv.context';

jest.mock('@/app/cv/context/cv.context', () => ({
	useCV: jest.fn(),
}));

jest.mock('@/app/components', () => ({
	Flex: ({
		children,
		direction,
		id,
	}: {
		children: React.ReactNode;
		direction?: string;
		id?: string;
	}) => <div id={id} data-direction={direction}>{children}</div>,
}));

const mockUseCV = jest.mocked(useCV);

beforeEach(() => {
	mockUseCV.mockReturnValue({
		name: '',
		titles: [],
		intro: '',
		contact: {
			email: '',
			phone: '',
			social: { linkedin: '', github: '' },
		},
		work_experience: [],
		skills: [],
		languages: ['English', 'Hebrew', 'Spanish'],
	});
});

import { Languages } from '../languages.component';

describe('Languages', () => {
	it('renders the Languages heading', () => {
		render(<Languages />);
		expect(screen.getByText('Languages')).toBeInTheDocument();
	});

	it('renders a span for each language', () => {
		render(<Languages />);
		expect(screen.getByText('English')).toBeInTheDocument();
		expect(screen.getByText('Hebrew')).toBeInTheDocument();
		expect(screen.getByText('Spanish')).toBeInTheDocument();
	});

	it('renders the correct number of language tags', () => {
		render(<Languages />);
		expect(screen.getByText('English').tagName).toBe('SPAN');
		expect(screen.getByText('Hebrew').tagName).toBe('SPAN');
		expect(screen.getByText('Spanish').tagName).toBe('SPAN');
	});

	it('renders with id "languages"', () => {
		render(<Languages />);
		expect(document.getElementById('languages')).toBeInTheDocument();
	});

	it('renders nothing in the tag list when languages array is empty', () => {
		mockUseCV.mockReturnValueOnce({
			name: '',
			titles: [],
			intro: '',
			contact: {
				email: '',
				phone: '',
				social: { linkedin: '', github: '' },
			},
			work_experience: [],
			skills: [],
			languages: [],
		});
		render(<Languages />);
		expect(screen.getByText('Languages')).toBeInTheDocument();
		expect(screen.queryByRole('none')).not.toBeInTheDocument();
	});

	it('renders a single language', () => {
		mockUseCV.mockReturnValueOnce({
			name: '',
			titles: [],
			intro: '',
			contact: {
				email: '',
				phone: '',
				social: { linkedin: '', github: '' },
			},
			work_experience: [],
			skills: [],
			languages: ['English'],
		});
		render(<Languages />);
		expect(screen.getByText('English')).toBeInTheDocument();
	});
});
