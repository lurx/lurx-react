import { render, screen } from '@testing-library/react';
import { DemoCredits } from '../demo-credits.component';

jest.mock('@/app/components', () => ({
	Flex: ({ children, ...props }: { children: React.ReactNode; gap?: string; justify?: string }) => (
		<div data-testid="flex" data-gap={props.gap} data-justify={props.justify}>{children}</div>
	),
	Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
		<a href={href}>{children}</a>
	),
}));

const mockCredits = {
	name: 'Test Project',
	url: 'https://example.com/project',
	author: 'Test Author',
	authorUrl: 'https://example.com/author',
};

describe('DemoCredits', () => {
	it('renders null when no credits are provided', () => {
		const { container } = render(<DemoCredits />);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders credits content', () => {
		render(<DemoCredits credits={mockCredits} />);
		const flex = screen.getByTestId('flex');
		expect(flex.textContent).toContain('Inspired by');
		expect(flex.textContent).toContain('by');
	});

	it('renders project name as a link', () => {
		render(<DemoCredits credits={mockCredits} />);
		const link = screen.getByText('Test Project').closest('a');
		expect(link).toHaveAttribute('href', 'https://example.com/project');
	});

	it('renders author name as a link', () => {
		render(<DemoCredits credits={mockCredits} />);
		const link = screen.getByText('Test Author').closest('a');
		expect(link).toHaveAttribute('href', 'https://example.com/author');
	});

	it('uses Flex with small gap and center justify', () => {
		render(<DemoCredits credits={mockCredits} />);
		const flex = screen.getByTestId('flex');
		expect(flex).toHaveAttribute('data-gap', 'small');
		expect(flex).toHaveAttribute('data-justify', 'center');
	});
});
