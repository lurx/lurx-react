import { render, screen } from '@testing-library/react';
import { useCV } from '@/app/cv/context/cv.context';

jest.mock('@/app/cv/context/cv.context', () => ({
	useCV: jest.fn(),
}));

jest.mock('@/app/components', () => ({
	FaIcon: ({ iconName, iconGroup }: { iconName: string; iconGroup: string }) => (
		<span data-testid="fa-icon" data-icon-name={iconName} data-icon-group={iconGroup} />
	),
	Flex: ({ children, className }: { children: React.ReactNode; className?: string }) => (
		<div className={className}>{children}</div>
	),
	Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
		<a href={href}>{children}</a>
	),
}));

const mockUseCV = jest.mocked(useCV);

const mockContact = {
	email: 'test@example.com',
	phone: '+1234567890',
	website: 'https://test.com',
	social: {
		linkedin: 'https://linkedin.com/in/test',
		github: 'https://github.com/test',
	},
};

beforeEach(() => {
	mockUseCV.mockReturnValue({
		name: 'Test User',
		titles: [],
		intro: '',
		contact: mockContact,
		work_experience: [],
		skills: [],
		languages: [],
	});
});

import { Contact } from '../contact.component';

describe('Contact', () => {
	it('renders the Email contact item', () => {
		render(<Contact />);
		expect(screen.getByText('Email')).toBeInTheDocument();
	});

	it('renders the Phone contact item', () => {
		render(<Contact />);
		expect(screen.getByText('Phone')).toBeInTheDocument();
	});

	it('renders the LinkedIn contact item', () => {
		render(<Contact />);
		expect(screen.getByText('LinkedIn')).toBeInTheDocument();
	});

	it('renders the GitHub contact item', () => {
		render(<Contact />);
		expect(screen.getByText('GitHub')).toBeInTheDocument();
	});

	it('renders the email link with mailto href', () => {
		render(<Contact />);
		const link = screen.getByRole('link', { name: /email/i });
		expect(link).toHaveAttribute('href', 'mailto:test@example.com');
	});

	it('renders the phone link with tel href', () => {
		render(<Contact />);
		const link = screen.getByRole('link', { name: /phone/i });
		expect(link).toHaveAttribute('href', 'tel:+1234567890');
	});

	it('renders the LinkedIn link with correct href', () => {
		render(<Contact />);
		const link = screen.getByRole('link', { name: /linkedin/i });
		expect(link).toHaveAttribute('href', 'https://linkedin.com/in/test');
	});

	it('renders the GitHub link with correct href', () => {
		render(<Contact />);
		const link = screen.getByRole('link', { name: /github/i });
		expect(link).toHaveAttribute('href', 'https://github.com/test');
	});

	it('uses fas icon group for Email', () => {
		render(<Contact />);
		const icons = screen.getAllByTestId('fa-icon');
		const emailIcon = icons.find(icon => (icon as HTMLElement).dataset.iconName === 'at');
		expect((emailIcon as HTMLElement).dataset.iconGroup).toBe('fas');
	});

	it('uses fas icon group for Phone', () => {
		render(<Contact />);
		const icons = screen.getAllByTestId('fa-icon');
		const phoneIcon = icons.find(icon => (icon as HTMLElement).dataset.iconName === 'phone');
		expect((phoneIcon as HTMLElement).dataset.iconGroup).toBe('fas');
	});

	it('uses fab icon group for LinkedIn', () => {
		render(<Contact />);
		const icons = screen.getAllByTestId('fa-icon');
		const linkedinIcon = icons.find(icon => (icon as HTMLElement).dataset.iconName === 'linkedin');
		expect((linkedinIcon as HTMLElement).dataset.iconGroup).toBe('fab');
	});

	it('uses fab icon group for GitHub', () => {
		render(<Contact />);
		const icons = screen.getAllByTestId('fa-icon');
		const githubIcon = icons.find(icon => (icon as HTMLElement).dataset.iconName === 'github');
		expect((githubIcon as HTMLElement).dataset.iconGroup).toBe('fab');
	});
});
