import { render } from '@testing-library/react';
import { BorderLines } from '../border-lines.component';

describe('BorderLines', () => {
	it('renders two span elements', () => {
		const { container } = render(<BorderLines />);
		const spans = container.querySelectorAll('span');
		expect(spans).toHaveLength(2);
	});

	it('renders a span with data-border-h="nav"', () => {
		const { container } = render(<BorderLines />);
		const navBorder = container.querySelector('[data-border-h="nav"]');
		expect(navBorder).toBeInTheDocument();
	});

	it('renders a span with data-border-h="footer"', () => {
		const { container } = render(<BorderLines />);
		const footerBorder = container.querySelector('[data-border-h="footer"]');
		expect(footerBorder).toBeInTheDocument();
	});

	it('marks the nav border span as aria-hidden', () => {
		const { container } = render(<BorderLines />);
		const navBorder = container.querySelector('[data-border-h="nav"]');
		expect(navBorder).toHaveAttribute('aria-hidden', 'true');
	});

	it('marks the footer border span as aria-hidden', () => {
		const { container } = render(<BorderLines />);
		const footerBorder = container.querySelector('[data-border-h="footer"]');
		expect(footerBorder).toHaveAttribute('aria-hidden', 'true');
	});

	it('renders spans as span elements (not divs or other tags)', () => {
		const { container } = render(<BorderLines />);
		const spans = container.querySelectorAll('span');
		expect(spans[0].tagName).toBe('SPAN');
		expect(spans[1].tagName).toBe('SPAN');
	});
});
