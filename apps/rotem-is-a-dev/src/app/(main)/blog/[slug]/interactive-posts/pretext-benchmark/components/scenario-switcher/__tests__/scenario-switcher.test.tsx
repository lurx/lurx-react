import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../pretext-benchmark.constants', () => ({
	SCENARIOS: [
		{ id: 'virtual', icon: '\u{1F4DC}', title: 'Virtualised Lists', description: 'Variable-height rows' },
		{ id: 'shrinkwrap', icon: '\u{1F4AC}', title: 'Chat Bubbles', description: 'Exact shrinkwrap' },
		{ id: 'masonry', icon: '\u{1F9F1}', title: 'Masonry Layout', description: 'Assign cards to columns' },
		{ id: 'justification', icon: '\u2302', title: 'Typography', description: 'Balanced justification' },
	],
}));

jest.mock('../scenarios/scenario-virtual.component', () => ({
	ScenarioVirtual: () => <div data-testid="panel-virtual">Virtual Panel</div>,
}));

jest.mock('../scenarios/scenario-shrinkwrap.component', () => ({
	ScenarioShrinkwrap: () => <div data-testid="panel-shrinkwrap">Shrinkwrap Panel</div>,
}));

jest.mock('../scenarios/scenario-masonry.component', () => ({
	ScenarioMasonry: () => <div data-testid="panel-masonry">Masonry Panel</div>,
}));

jest.mock('../scenarios/scenario-typography.component', () => ({
	ScenarioTypography: () => <div data-testid="panel-typography">Typography Panel</div>,
}));

import { ScenarioSwitcher } from '../scenario-switcher.component';

describe('ScenarioSwitcher', () => {
	const defaultProps = {
		activeScenario: 'virtual' as const,
		onSelectAction: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders all scenario cards', () => {
		render(<ScenarioSwitcher {...defaultProps} />);

		expect(screen.getByText('Virtualised Lists')).toBeInTheDocument();
		expect(screen.getByText('Chat Bubbles')).toBeInTheDocument();
		expect(screen.getByText('Masonry Layout')).toBeInTheDocument();
		expect(screen.getByText('Typography')).toBeInTheDocument();
	});

	it('renders scenario descriptions', () => {
		render(<ScenarioSwitcher {...defaultProps} />);

		expect(screen.getByText('Variable-height rows')).toBeInTheDocument();
		expect(screen.getByText('Exact shrinkwrap')).toBeInTheDocument();
		expect(screen.getByText('Assign cards to columns')).toBeInTheDocument();
		expect(screen.getByText('Balanced justification')).toBeInTheDocument();
	});

	it('renders scenario icons', () => {
		render(<ScenarioSwitcher {...defaultProps} />);

		expect(screen.getByText('\u{1F4DC}')).toBeInTheDocument();
		expect(screen.getByText('\u{1F4AC}')).toBeInTheDocument();
		expect(screen.getByText('\u{1F9F1}')).toBeInTheDocument();
		expect(screen.getByText('\u2302')).toBeInTheDocument();
	});

	it('highlights the active scenario card', () => {
		render(<ScenarioSwitcher {...defaultProps} />);

		const virtualButton = screen.getByText('Virtualised Lists').closest('button');
		expect(virtualButton?.className).toContain('active');

		const shrinkwrapButton = screen.getByText('Chat Bubbles').closest('button');
		expect(shrinkwrapButton?.className).not.toContain('active');
	});

	it('highlights the correct card when activeScenario changes', () => {
		render(<ScenarioSwitcher {...defaultProps} activeScenario="masonry" />);

		const masonryButton = screen.getByText('Masonry Layout').closest('button');
		expect(masonryButton?.className).toContain('active');

		const virtualButton = screen.getByText('Virtualised Lists').closest('button');
		expect(virtualButton?.className).not.toContain('active');
	});

	it('calls onSelectAction with the scenario id when a card is clicked', () => {
		const onSelectAction = jest.fn();

		render(<ScenarioSwitcher {...defaultProps} onSelectAction={onSelectAction} />);

		fireEvent.click(screen.getByText('Chat Bubbles').closest('button')!);

		expect(onSelectAction).toHaveBeenCalledWith('shrinkwrap');
	});

	it('calls onSelectAction with masonry id when masonry card is clicked', () => {
		const onSelectAction = jest.fn();

		render(<ScenarioSwitcher {...defaultProps} onSelectAction={onSelectAction} />);

		fireEvent.click(screen.getByText('Masonry Layout').closest('button')!);

		expect(onSelectAction).toHaveBeenCalledWith('masonry');
	});

	it('renders the virtual panel when activeScenario is virtual', () => {
		render(<ScenarioSwitcher {...defaultProps} />);

		expect(screen.getByTestId('panel-virtual')).toBeInTheDocument();
		expect(screen.queryByTestId('panel-shrinkwrap')).not.toBeInTheDocument();
	});

	it('renders the shrinkwrap panel when activeScenario is shrinkwrap', () => {
		render(<ScenarioSwitcher {...defaultProps} activeScenario="shrinkwrap" />);

		expect(screen.getByTestId('panel-shrinkwrap')).toBeInTheDocument();
		expect(screen.queryByTestId('panel-virtual')).not.toBeInTheDocument();
	});

	it('renders the masonry panel when activeScenario is masonry', () => {
		render(<ScenarioSwitcher {...defaultProps} activeScenario="masonry" />);

		expect(screen.getByTestId('panel-masonry')).toBeInTheDocument();
	});

	it('renders the typography panel when activeScenario is justification', () => {
		render(<ScenarioSwitcher {...defaultProps} activeScenario="justification" />);

		expect(screen.getByTestId('panel-typography')).toBeInTheDocument();
	});

	it('renders all cards as buttons with type button', () => {
		render(<ScenarioSwitcher {...defaultProps} />);

		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(4);
		buttons.forEach(button => {
			expect(button).toHaveAttribute('type', 'button');
		});
	});
});
