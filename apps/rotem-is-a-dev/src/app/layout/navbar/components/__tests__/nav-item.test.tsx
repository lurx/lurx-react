import { render, screen } from '@testing-library/react';
import { NavItem } from '../nav-item.component';

describe('NavItem', () => {
	it('renders the label', () => {
		render(<NavItem label="hello" href="#hello" active={false} />);
		expect(screen.getByText('_hello')).toBeInTheDocument();
	});

	it('renders a link with the correct href', () => {
		render(<NavItem label="hello" href="#hello" active={false} />);
		expect(screen.getByText('_hello')).toHaveAttribute('href', '#hello');
	});

	it('sets aria-current="page" when active', () => {
		render(<NavItem label="hello" href="#hello" active={true} />);
		expect(screen.getByText('_hello')).toHaveAttribute('aria-current', 'page');
	});

	it('does not set aria-current when not active', () => {
		render(<NavItem label="hello" href="#hello" active={false} />);
		expect(screen.getByText('_hello')).not.toHaveAttribute('aria-current');
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
});
