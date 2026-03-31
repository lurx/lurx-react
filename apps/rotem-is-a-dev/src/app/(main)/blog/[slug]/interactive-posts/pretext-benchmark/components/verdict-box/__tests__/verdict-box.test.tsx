import { render, screen } from '@testing-library/react';
import { VerdictBox } from '../verdict-box.component';

describe('VerdictBox', () => {
	it('renders the title', () => {
		render(<VerdictBox title="Test Title">content</VerdictBox>);
		expect(screen.getByText('Test Title')).toBeInTheDocument();
	});

	it('renders children', () => {
		render(
			<VerdictBox title="Title">
				<p>Child paragraph</p>
			</VerdictBox>,
		);
		expect(screen.getByText('Child paragraph')).toBeInTheDocument();
	});

	it('renders a wrapper div with the box class', () => {
		const { container } = render(<VerdictBox title="Title">content</VerdictBox>);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper.tagName).toBe('DIV');
		expect(wrapper.className).toContain('box');
	});

	it('renders the title inside a div with the title class', () => {
		render(<VerdictBox title="My Title">content</VerdictBox>);
		const titleElement = screen.getByText('My Title');
		expect(titleElement.className).toContain('title');
	});
});
