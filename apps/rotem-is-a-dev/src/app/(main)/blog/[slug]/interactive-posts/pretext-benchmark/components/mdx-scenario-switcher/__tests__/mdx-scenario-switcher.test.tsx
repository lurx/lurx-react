import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../scenario-switcher', () => ({
	ScenarioSwitcher: ({ activeScenario, onSelectAction }: { activeScenario: string; onSelectAction: (id: string) => void }) => (
		<div data-testid="scenario-switcher">
			<span data-testid="active-scenario">{activeScenario}</span>
			<button data-testid="select-shrinkwrap" onClick={() => onSelectAction('shrinkwrap')}>Select Shrinkwrap</button>
			<button data-testid="select-masonry" onClick={() => onSelectAction('masonry')}>Select Masonry</button>
		</div>
	),
}));

import { MdxScenarioSwitcher } from '../mdx-scenario-switcher.component';

describe('MdxScenarioSwitcher', () => {
	it('renders ScenarioSwitcher with initial activeScenario of virtual', () => {
		render(<MdxScenarioSwitcher />);

		expect(screen.getByTestId('scenario-switcher')).toBeInTheDocument();
		expect(screen.getByTestId('active-scenario')).toHaveTextContent('virtual');
	});

	it('updates activeScenario when onSelectAction is called', () => {
		render(<MdxScenarioSwitcher />);

		fireEvent.click(screen.getByTestId('select-shrinkwrap'));

		expect(screen.getByTestId('active-scenario')).toHaveTextContent('shrinkwrap');
	});

	it('supports switching between multiple scenarios', () => {
		render(<MdxScenarioSwitcher />);

		fireEvent.click(screen.getByTestId('select-shrinkwrap'));
		expect(screen.getByTestId('active-scenario')).toHaveTextContent('shrinkwrap');

		fireEvent.click(screen.getByTestId('select-masonry'));
		expect(screen.getByTestId('active-scenario')).toHaveTextContent('masonry');
	});
});
