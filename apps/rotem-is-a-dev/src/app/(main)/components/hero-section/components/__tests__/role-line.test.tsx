import { render, screen } from '@testing-library/react';
import { RoleLine } from '../role-line.component';

describe('RoleLine', () => {
	it('renders a paragraph element', () => {
		const { container } = render(<RoleLine />);
		expect(container.querySelector('p')).toBeInTheDocument();
	});

	it('renders the role text', () => {
		render(<RoleLine />);
		expect(screen.getByText(/front-end developer/i)).toBeInTheDocument();
	});

	it('includes the arrow prefix in the rendered text', () => {
		render(<RoleLine />);
		expect(screen.getByText(/^>\s/)).toBeInTheDocument();
	});

	it('has the data-hero-intro="role" attribute', () => {
		const { container } = render(<RoleLine />);
		const para = container.querySelector('[data-hero-intro="role"]');
		expect(para).toBeInTheDocument();
	});

	it('renders the full formatted text with prefix and role', () => {
		render(<RoleLine />);
		const para = screen.getByText(/front-end developer/i);
		expect(para.textContent).toContain('>');
		expect(para.textContent?.toLowerCase()).toContain('front-end developer');
	});
});
