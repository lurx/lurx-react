import { render, screen } from '@testing-library/react';
import { FilterPanel } from '../filter-panel.component';

describe('FilterPanel', () => {
	it('renders children inside an aside element', () => {
		render(<FilterPanel><span>Filter content</span></FilterPanel>);
		const content = screen.getByText('Filter content');
		expect(content).toBeInTheDocument();
		expect(content.closest('aside')).toBeInTheDocument();
	});

	it('applies the filterPanel class', () => {
		const { container } = render(<FilterPanel>content</FilterPanel>);
		const aside = container.firstChild as HTMLElement;
		expect(aside.tagName).toBe('ASIDE');
		expect(aside.className).toContain('filterPanel');
	});
});
