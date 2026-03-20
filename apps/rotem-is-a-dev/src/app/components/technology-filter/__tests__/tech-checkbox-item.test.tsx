import { fireEvent, render, screen } from '@testing-library/react';
import { TechCheckboxItem } from '../tech-checkbox-item.component';

jest.mock('@/app/components', () => ({
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="icon">{iconName}</span>
	),
}));

const defaultProps = {
	tech: 'React' as Technology,
	isChecked: false,
	onToggleAction: jest.fn<void, [Technology]>(),
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('TechCheckboxItem', () => {
	it('renders the tech name', () => {
		render(<TechCheckboxItem {...defaultProps} />);
		expect(screen.getByText('React')).toBeInTheDocument();
	});

	it('renders a checkbox input', () => {
		render(<TechCheckboxItem {...defaultProps} />);
		expect(screen.getByRole('checkbox')).toBeInTheDocument();
	});

	it('renders an unchecked checkbox when isChecked is false', () => {
		render(<TechCheckboxItem {...defaultProps} isChecked={false} />);
		expect(screen.getByRole('checkbox')).not.toBeChecked();
	});

	it('renders a checked checkbox when isChecked is true', () => {
		render(<TechCheckboxItem {...defaultProps} isChecked={true} />);
		expect(screen.getByRole('checkbox')).toBeChecked();
	});

	it('calls onToggleAction with the tech name when checkbox changes', () => {
		const onToggle = jest.fn();
		render(<TechCheckboxItem {...defaultProps} onToggleAction={onToggle} />);
		fireEvent.click(screen.getByRole('checkbox'));
		expect(onToggle).toHaveBeenCalledWith('React');
	});

	it('applies checked class to the visual checkbox when isChecked is true', () => {
		const { container } = render(<TechCheckboxItem {...defaultProps} isChecked={true} />);
		const visualCheckbox = container.querySelector('[class*="checkbox"]');
		expect(visualCheckbox?.className).toContain('checked');
	});

	it('does not apply checked class when isChecked is false', () => {
		const { container } = render(<TechCheckboxItem {...defaultProps} isChecked={false} />);
		const visualCheckbox = container.querySelector('[class*="checkbox"][aria-hidden]');
		expect(visualCheckbox?.className).not.toContain('checked');
	});

	it('renders a check icon when isChecked is true', () => {
		render(<TechCheckboxItem {...defaultProps} isChecked={true} />);
		expect(screen.getByTestId('icon')).toHaveTextContent('check');
	});

	it('does not render a check icon when isChecked is false', () => {
		render(<TechCheckboxItem {...defaultProps} isChecked={false} />);
		expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
	});

	it('renders a tech icon when iconInfo is provided', () => {
		render(
			<TechCheckboxItem
				{...defaultProps}
				iconInfo={{ iconName: 'react', iconGroup: 'fab' }}
			/>,
		);
		const icons = screen.getAllByTestId('icon');
		expect(icons.some(icon => icon.textContent === 'react')).toBe(true);
	});

	it('does not render a tech icon when iconInfo is omitted', () => {
		render(<TechCheckboxItem {...defaultProps} />);
		expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
	});

	it('renders both check icon and tech icon when isChecked and iconInfo are provided', () => {
		render(
			<TechCheckboxItem
				{...defaultProps}
				isChecked={true}
				iconInfo={{ iconName: 'react', iconGroup: 'fab' }}
			/>,
		);
		const icons = screen.getAllByTestId('icon');
		expect(icons).toHaveLength(2);
	});

	it('marks the visual checkbox as aria-hidden', () => {
		const { container } = render(<TechCheckboxItem {...defaultProps} />);
		const visualCheckbox = container.querySelector('[class*="checkbox"]');
		expect(visualCheckbox).toHaveAttribute('aria-hidden', 'true');
	});
});
