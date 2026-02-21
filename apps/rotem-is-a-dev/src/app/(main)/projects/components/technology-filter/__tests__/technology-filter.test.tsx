import { fireEvent, render, screen } from '@testing-library/react';
import { TechnologyFilter } from '../technology-filter.component';
import type { Technology } from '../../../data/projects.data';

const TECHNOLOGIES: Technology[] = ['React', 'HTML', 'CSS', 'SCSS'];

describe('TechnologyFilter', () => {
	it('renders the accordion section label', () => {
		render(
			<TechnologyFilter
				technologies={TECHNOLOGIES}
				selected={[]}
				onToggle={() => undefined}
			/>,
		);
		expect(screen.getByText('projects')).toBeInTheDocument();
	});

	it('renders all provided technology options', () => {
		render(
			<TechnologyFilter
				technologies={TECHNOLOGIES}
				selected={[]}
				onToggle={() => undefined}
			/>,
		);
		expect(screen.getByText('React')).toBeInTheDocument();
		expect(screen.getByText('HTML')).toBeInTheDocument();
		expect(screen.getByText('CSS')).toBeInTheDocument();
		expect(screen.getByText('SCSS')).toBeInTheDocument();
	});

	it('calls onToggle with the technology when a row is clicked', () => {
		const onToggle = jest.fn();
		render(
			<TechnologyFilter
				technologies={TECHNOLOGIES}
				selected={[]}
				onToggle={onToggle}
			/>,
		);
		fireEvent.click(screen.getByRole('checkbox', { name: 'React' }));
		expect(onToggle).toHaveBeenCalledWith('React');
	});

	it('shows checked state for selected technologies', () => {
		render(
			<TechnologyFilter
				technologies={TECHNOLOGIES}
				selected={['React']}
				onToggle={() => undefined}
			/>,
		);
		const reactCheckbox = screen.getByRole('checkbox', { name: 'React' });
		expect(reactCheckbox).toHaveAttribute('aria-checked', 'true');
	});

	it('shows unchecked state for unselected technologies', () => {
		render(
			<TechnologyFilter
				technologies={TECHNOLOGIES}
				selected={['React']}
				onToggle={() => undefined}
			/>,
		);
		const htmlCheckbox = screen.getByRole('checkbox', { name: 'HTML' });
		expect(htmlCheckbox).toHaveAttribute('aria-checked', 'false');
	});
});
