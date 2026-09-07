import { render } from '@testing-library/react';
import { BorderLines } from '../border-lines.component';

describe('BorderLines', () => {
	it('renders two span elements', () => {
		const { container } = render(<BorderLines />);
		const spans = container.querySelectorAll('span');
		expect(spans).toHaveLength(2);
	});

	it('marks both border spans as aria-hidden', () => {
		const { container } = render(<BorderLines />);
		const spans = container.querySelectorAll('span');
		expect(spans[0]).toHaveAttribute('aria-hidden', 'true');
		expect(spans[1]).toHaveAttribute('aria-hidden', 'true');
	});

	it('renders spans as span elements (not divs or other tags)', () => {
		const { container } = render(<BorderLines />);
		const spans = container.querySelectorAll('span');
		expect(spans[0].tagName).toBe('SPAN');
		expect(spans[1].tagName).toBe('SPAN');
	});
});
