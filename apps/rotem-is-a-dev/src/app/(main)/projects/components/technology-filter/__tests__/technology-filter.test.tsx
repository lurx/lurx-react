import { fireEvent, render, screen } from '@testing-library/react';
import { TechnologyFilter } from '../technology-filter.component';
import type { Technology } from '../../../data/projects.data';

const mockUseResponsive = jest.fn();

jest.mock('@/hooks', () => ({
	useResponsive: () => mockUseResponsive(),
}));

const TECHNOLOGIES: Technology[] = ['React', 'HTML', 'CSS', 'SCSS'];

beforeEach(() => {
	mockUseResponsive.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true });
});

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

	it('calls onToggle with the technology when a checkbox is clicked', () => {
		const onToggle = jest.fn();
		render(
			<TechnologyFilter
				technologies={TECHNOLOGIES}
				selected={[]}
				onToggle={onToggle}
			/>,
		);
		fireEvent.click(screen.getByRole('checkbox', { name: /React/ }));
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
		const reactCheckbox = screen.getByRole('checkbox', { name: /React/ });
		expect(reactCheckbox).toBeChecked();
	});

	it('shows unchecked state for unselected technologies', () => {
		render(
			<TechnologyFilter
				technologies={TECHNOLOGIES}
				selected={['React']}
				onToggle={() => undefined}
			/>,
		);
		const htmlCheckbox = screen.getByRole('checkbox', { name: /HTML/ });
		expect(htmlCheckbox).not.toBeChecked();
	});

	describe('mobile collapse behavior', () => {
		beforeEach(() => {
			mockUseResponsive.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false });
		});

		it('shows the tech list by default on mobile (not collapsed)', () => {
			render(
				<TechnologyFilter
					technologies={TECHNOLOGIES}
					selected={[]}
					onToggle={() => undefined}
				/>,
			);
			expect(screen.getByText('React')).toBeInTheDocument();
		});

		it('hides the tech list when section header is clicked on mobile', () => {
			render(
				<TechnologyFilter
					technologies={TECHNOLOGIES}
					selected={[]}
					onToggle={() => undefined}
				/>,
			);
			const sectionHeader = screen.getByRole('button', { name: /projects/i });
			fireEvent.click(sectionHeader);

			expect(screen.queryByText('React')).not.toBeInTheDocument();
		});

		it('shows the tech list again when section header is clicked twice on mobile', () => {
			render(
				<TechnologyFilter
					technologies={TECHNOLOGIES}
					selected={[]}
					onToggle={() => undefined}
				/>,
			);
			const sectionHeader = screen.getByRole('button', { name: /projects/i });
			fireEvent.click(sectionHeader);
			expect(screen.queryByText('React')).not.toBeInTheDocument();

			fireEvent.click(sectionHeader);
			expect(screen.getByText('React')).toBeInTheDocument();
		});

		it('sets aria-expanded to false when collapsed on mobile', () => {
			render(
				<TechnologyFilter
					technologies={TECHNOLOGIES}
					selected={[]}
					onToggle={() => undefined}
				/>,
			);
			const sectionHeader = screen.getByRole('button', { name: /projects/i });
			fireEvent.click(sectionHeader);

			expect(sectionHeader).toHaveAttribute('aria-expanded', 'false');
		});
	});

	describe('desktop collapse behavior', () => {
		it('does not collapse when section header is clicked on desktop', () => {
			mockUseResponsive.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true });
			render(
				<TechnologyFilter
					technologies={TECHNOLOGIES}
					selected={[]}
					onToggle={() => undefined}
				/>,
			);
			const sectionHeader = screen.getByRole('button', { name: /projects/i });
			fireEvent.click(sectionHeader);

			expect(screen.getByText('React')).toBeInTheDocument();
			expect(sectionHeader).toHaveAttribute('aria-expanded', 'true');
		});
	});
});
