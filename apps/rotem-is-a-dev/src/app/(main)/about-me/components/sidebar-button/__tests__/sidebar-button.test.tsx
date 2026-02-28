import { fireEvent, render, screen } from '@testing-library/react';
import { SideBarButton } from '../sidebar-button.component';

jest.mock('@/app/components', () => ({
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="icon">{iconName}</span>
	),
}));

describe('SideBarButton', () => {
	it('renders a button', () => {
		render(<SideBarButton ariaLabel="Personal info" iconName="user" />);
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('renders with the correct aria-label', () => {
		render(<SideBarButton ariaLabel="Work experience" iconName="briefcase" />);
		expect(screen.getByRole('button', { name: 'Work experience' })).toBeInTheDocument();
	});

	it('renders the icon by name', () => {
		render(<SideBarButton ariaLabel="Personal info" iconName="user" />);
		expect(screen.getByTestId('icon')).toHaveTextContent('user');
	});

	it('sets aria-pressed to true when isActive is true', () => {
		render(<SideBarButton ariaLabel="Personal info" iconName="user" isActive={true} />);
		expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
	});

	it('sets aria-pressed to false when isActive is false', () => {
		render(<SideBarButton ariaLabel="Personal info" iconName="user" isActive={false} />);
		expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
	});

	it('applies active class when isActive is true', () => {
		render(<SideBarButton ariaLabel="Personal info" iconName="user" isActive={true} />);
		expect(screen.getByRole('button').className).toContain('activeIcon');
	});

	it('does not apply active class when isActive is false', () => {
		render(<SideBarButton ariaLabel="Personal info" iconName="user" isActive={false} />);
		expect(screen.getByRole('button').className).not.toContain('activeIcon');
	});

	it('calls onClick when clicked', () => {
		const onClick = jest.fn();
		render(<SideBarButton ariaLabel="Personal info" iconName="user" onClick={onClick} />);
		fireEvent.click(screen.getByRole('button'));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('does not throw when onClick is omitted', () => {
		render(<SideBarButton ariaLabel="Personal info" iconName="user" />);
		expect(() => fireEvent.click(screen.getByRole('button'))).not.toThrow();
	});

	it('has type="button" to prevent form submission', () => {
		render(<SideBarButton ariaLabel="Personal info" iconName="user" />);
		expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
	});
});
