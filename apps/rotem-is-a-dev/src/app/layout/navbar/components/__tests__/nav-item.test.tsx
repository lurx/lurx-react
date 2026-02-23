import { render, screen } from '@testing-library/react';
import { NavItem } from '../nav-item.component';

describe('NavItem', () => {
	it('renders the label', () => {
		render(<NavItem label="hello" href="#hello" active={false} />);
		expect(screen.getByText('_hello')).toBeInTheDocument();
	});

	it('renders a link with the correct href', () => {
		render(<NavItem label="hello" href="#hello" active={false} />);
		expect(screen.getByText('_hello').closest('a')).toHaveAttribute('href', '#hello');
	});

	it('sets aria-current="page" when active', () => {
		render(<NavItem label="hello" href="#hello" active={true} />);
		expect(screen.getByText('_hello').closest('a')).toHaveAttribute('aria-current', 'page');
	});

	it('does not set aria-current when not active', () => {
		render(<NavItem label="hello" href="#hello" active={false} />);
		expect(screen.getByText('_hello').closest('a')).not.toHaveAttribute('aria-current');
	});

	it('renders nothing when enabled is false', () => {
		const { container } = render(
			<NavItem label="about-me" href="#about-me" active={false} enabled={false} />,
		);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders when enabled is true (default)', () => {
		render(<NavItem label="hello" href="#hello" active={false} enabled={true} />);
		expect(screen.getByText('_hello')).toBeInTheDocument();
	});

	it('renders an icon and hides label when iconOnly is true', () => {
		render(
			<NavItem
				label="settings"
				href="#settings"
				active={false}
				icon={<span data-testid="icon">icon</span>}
				iconOnly={true}
			/>,
		);
		expect(screen.getByTestId('icon')).toBeInTheDocument();
		// Label text should not be visible
		expect(screen.queryByText('_settings')).not.toBeInTheDocument();
		// aria-label should be set
		expect(screen.getByLabelText('settings')).toBeInTheDocument();
	});

	it('renders both icon and label when iconOnly is false', () => {
		render(
			<NavItem
				label="home"
				href="#home"
				active={false}
				icon={<span data-testid="icon">icon</span>}
				iconOnly={false}
			/>,
		);
		expect(screen.getByTestId('icon')).toBeInTheDocument();
		expect(screen.getByText('_home')).toBeInTheDocument();
	});

	it('renders a non-string label (JSX)', () => {
		render(
			<NavItem
				label={<span data-testid="jsx-label">custom</span>}
				href="#custom"
				active={false}
			/>,
		);
		expect(screen.getByTestId('jsx-label')).toBeInTheDocument();
	});

	it('applies className prop', () => {
		render(
			<NavItem label="test" href="#test" active={false} className="extra-class" />,
		);
		const link = screen.getByText('_test').closest('a');
		expect(link?.className).toContain('extra-class');
	});

	it('renders a button when onClick is provided', () => {
		const onClick = jest.fn();
		render(<NavItem label="action" onClick={onClick} active={false} />);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
	});

	it('calls onClick handler when button is clicked', () => {
		const onClick = jest.fn();
		render(<NavItem label="action" onClick={onClick} active={false} />);
		screen.getByRole('button').click();
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('renders a link when href is provided without onClick', () => {
		render(<NavItem label="link" href="/page" active={false} />);
		expect(screen.getByRole('link')).toHaveAttribute('href', '/page');
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});
});
