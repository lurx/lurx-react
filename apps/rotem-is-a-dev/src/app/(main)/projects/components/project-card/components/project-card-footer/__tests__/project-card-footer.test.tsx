import { fireEvent, render, screen } from '@testing-library/react';
import { ProjectCardFooter } from '../project-card-footer.component';

describe('ProjectCardFooter', () => {
	it('renders the footer', () => {
		render(<ProjectCardFooter onViewClickAction={jest.fn()} />);
		expect(screen.getByTestId('project-card-footer')).toBeInTheDocument();
	});

	it('renders the view-project button', () => {
		render(<ProjectCardFooter onViewClickAction={jest.fn()} />);
		expect(screen.getByTestId('card-view-button')).toBeInTheDocument();
		expect(screen.getByText('view-project')).toBeInTheDocument();
	});

	it('calls onViewClickAction when the view-project button is clicked', () => {
		const onViewClick = jest.fn();
		render(<ProjectCardFooter onViewClickAction={onViewClick} />);
		fireEvent.click(screen.getByTestId('card-view-button'));
		expect(onViewClick).toHaveBeenCalledTimes(1);
	});
});
