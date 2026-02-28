import { render, screen } from '@testing-library/react';
import { Gist } from '../gist.component';

jest.mock('@/app/components', () => ({
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="icon">{iconName}</span>
	),
	CodeBlock: ({ 'aria-label': ariaLabel }: { 'aria-label': string }) => (
		<div data-testid="code-block" aria-label={ariaLabel} />
	),
}));

const defaultProps = {
	title: 'my-snippet',
	username: 'rotem',
	createdAt: '2024-01-15',
	detailsCount: 3,
	starsCount: 42,
	code: 'const x = 1;',
};

describe('Gist', () => {
	it('renders the username with @ prefix', () => {
		render(<Gist {...defaultProps} />);
		expect(screen.getByText('@rotem')).toBeInTheDocument();
	});

	it('renders the createdAt date', () => {
		render(<Gist {...defaultProps} />);
		expect(screen.getByText('2024-01-15')).toBeInTheDocument();
	});

	it('renders the details count', () => {
		render(<Gist {...defaultProps} />);
		expect(screen.getByText('3 details')).toBeInTheDocument();
	});

	it('renders the stars count', () => {
		render(<Gist {...defaultProps} />);
		expect(screen.getByText('42 stars')).toBeInTheDocument();
	});

	it('renders the first letter of the username as avatar', () => {
		render(<Gist {...defaultProps} />);
		expect(screen.getByText('R')).toBeInTheDocument();
	});

	it('renders avatar with uppercase first character', () => {
		render(<Gist {...defaultProps} username="alice" />);
		expect(screen.getByText('A')).toBeInTheDocument();
	});

	it('renders the CodeBlock with the title as aria-label', () => {
		render(<Gist {...defaultProps} />);
		expect(screen.getByLabelText('my-snippet content')).toBeInTheDocument();
	});

	it('renders the comment icon', () => {
		render(<Gist {...defaultProps} />);
		const icons = screen.getAllByTestId('icon');
		expect(icons.some(icon => icon.textContent === 'comment')).toBe(true);
	});

	it('renders the star icon', () => {
		render(<Gist {...defaultProps} />);
		const icons = screen.getAllByTestId('icon');
		expect(icons.some(icon => icon.textContent === 'star')).toBe(true);
	});

	it('renders zero counts correctly', () => {
		render(<Gist {...defaultProps} detailsCount={0} starsCount={0} />);
		expect(screen.getByText('0 details')).toBeInTheDocument();
		expect(screen.getByText('0 stars')).toBeInTheDocument();
	});
});
