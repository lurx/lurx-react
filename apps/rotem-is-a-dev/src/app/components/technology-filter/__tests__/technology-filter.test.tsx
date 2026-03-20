import { fireEvent, render, screen } from '@testing-library/react';
import { TechnologyFilter } from '../technology-filter.component';

const mockUseResponsive = jest.fn();

jest.mock('@/hooks', () => ({
	useResponsive: () => mockUseResponsive(),
}));

const TECHNOLOGIES = ['react', 'html', 'css', 'scss'] as Technology[];

beforeEach(() => {
	mockUseResponsive.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true });
});

describe('TechnologyFilter', () => {
	it('renders the accordion section label', () => {
		render(
			<TechnologyFilter
				technologies={TECHNOLOGIES}
				selected={[]}
				onToggleAction={() => undefined}
			/>,
		);
		expect(screen.getByText('projects')).toBeInTheDocument();
	});

	it('renders all provided technology options', () => {
		render(
			<TechnologyFilter
				technologies={TECHNOLOGIES}
				selected={[]}
				onToggleAction={() => undefined}
			/>,
		);
		expect(screen.getByText('react')).toBeInTheDocument();
		expect(screen.getByText('html')).toBeInTheDocument();
		expect(screen.getByText('css')).toBeInTheDocument();
		expect(screen.getByText('scss')).toBeInTheDocument();
	});

	it('calls onToggleAction with the technology when a checkbox is clicked', () => {
		const onToggle = jest.fn();
		render(
			<TechnologyFilter
				technologies={TECHNOLOGIES}
				selected={[]}
				onToggleAction={onToggle}
			/>,
		);
		fireEvent.click(screen.getByRole('checkbox', { name: /react/ }));
		expect(onToggle).toHaveBeenCalledWith('react');
	});

	it('shows checked state for selected technologies', () => {
		render(
			<TechnologyFilter
				technologies={TECHNOLOGIES}
				selected={['react' as Technology]}
				onToggleAction={() => undefined}
			/>,
		);
		const reactCheckbox = screen.getByRole('checkbox', { name: /react/ });
		expect(reactCheckbox).toBeChecked();
	});

	it('shows unchecked state for unselected technologies', () => {
		render(
			<TechnologyFilter
				technologies={TECHNOLOGIES}
				selected={['react' as Technology]}
				onToggleAction={() => undefined}
			/>,
		);
		const htmlCheckbox = screen.getByRole('checkbox', { name: /html/ });
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
					onToggleAction={() => undefined}
				/>,
			);
			expect(screen.getByText('react')).toBeInTheDocument();
		});

		it('hides the tech list when section header is clicked on mobile', () => {
			render(
				<TechnologyFilter
					technologies={TECHNOLOGIES}
					selected={[]}
					onToggleAction={() => undefined}
				/>,
			);
			const sectionHeader = screen.getByRole('button', { name: /projects/i });
			fireEvent.click(sectionHeader);

			expect(screen.queryByText('react')).not.toBeInTheDocument();
		});

		it('shows the tech list again when section header is clicked twice on mobile', () => {
			render(
				<TechnologyFilter
					technologies={TECHNOLOGIES}
					selected={[]}
					onToggleAction={() => undefined}
				/>,
			);
			const sectionHeader = screen.getByRole('button', { name: /projects/i });
			fireEvent.click(sectionHeader);
			expect(screen.queryByText('react')).not.toBeInTheDocument();

			fireEvent.click(sectionHeader);
			expect(screen.getByText('react')).toBeInTheDocument();
		});

		it('sets aria-expanded to false when collapsed on mobile', () => {
			render(
				<TechnologyFilter
					technologies={TECHNOLOGIES}
					selected={[]}
					onToggleAction={() => undefined}
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
					onToggleAction={() => undefined}
				/>,
			);
			const sectionHeader = screen.getByRole('button', { name: /projects/i });
			fireEvent.click(sectionHeader);

			expect(screen.getByText('react')).toBeInTheDocument();
			expect(sectionHeader).toHaveAttribute('aria-expanded', 'true');
		});
	});
});
