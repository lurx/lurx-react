import { render, screen, fireEvent } from '@testing-library/react';
import { ArrowKeyGrid } from '../arrow-key-grid.component';
import type { ArrowKeyGridItem } from '../arrow-key-grid.types';

jest.mock('../arrow-key-grid.module.scss', () => ({
	grid: 'grid',
	gridWithBottom: 'gridWithBottom',
	key: 'key',
	button: 'button',
	active: 'active',
	bottomKey: 'bottomKey',
}));

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const ITEMS: ArrowKeyGridItem<Direction>[] = [
	{ value: 'UP', label: '\u25B2', testId: 'key-up' },
	{ value: 'LEFT', label: '\u25C0', testId: 'key-left' },
	{ value: 'RIGHT', label: '\u25B6', testId: 'key-right' },
	{ value: 'DOWN', label: '\u25BC', testId: 'key-down' },
];

describe('ArrowKeyGrid', () => {
	it('renders all items', () => {
		render(<ArrowKeyGrid items={ITEMS} activeValue={null} />);
		expect(screen.getByTestId('key-up')).toBeInTheDocument();
		expect(screen.getByTestId('key-left')).toBeInTheDocument();
		expect(screen.getByTestId('key-right')).toBeInTheDocument();
		expect(screen.getByTestId('key-down')).toBeInTheDocument();
	});

	it('renders items as divs when no onPress is provided', () => {
		render(<ArrowKeyGrid items={ITEMS} activeValue={null} />);
		const element = screen.getByTestId('key-up');
		expect(element.tagName).toBe('DIV');
	});

	it('renders items as buttons when onPress is provided', () => {
		render(<ArrowKeyGrid items={ITEMS} activeValue={null} onPressAction={jest.fn()} />);
		const element = screen.getByTestId('key-up');
		expect(element.tagName).toBe('BUTTON');
	});

	it('applies active class to the matching item', () => {
		render(<ArrowKeyGrid items={ITEMS} activeValue="UP" />);
		expect(screen.getByTestId('key-up').className).toContain('active');
	});

	it('does not apply active class to non-matching items', () => {
		render(<ArrowKeyGrid items={ITEMS} activeValue="UP" />);
		expect(screen.getByTestId('key-down').className).not.toContain('active');
	});

	it('calls onPress with the item value when pressed', () => {
		const onPress = jest.fn();
		render(<ArrowKeyGrid items={ITEMS} activeValue={null} onPressAction={onPress} />);
		fireEvent.pointerDown(screen.getByTestId('key-left'));
		expect(onPress).toHaveBeenCalledWith('LEFT');
	});

	it('renders labels inside items', () => {
		render(<ArrowKeyGrid items={ITEMS} activeValue={null} />);
		expect(screen.getByTestId('key-up')).toHaveTextContent('\u25B2');
	});

	it('renders aria-labels on items', () => {
		render(<ArrowKeyGrid items={ITEMS} activeValue={null} />);
		expect(screen.getByLabelText('up')).toBeInTheDocument();
		expect(screen.getByLabelText('down')).toBeInTheDocument();
	});

	it('renders bottomAction when provided', () => {
		const bottom: ArrowKeyGridItem<'HARD_DROP'> = {
			value: 'HARD_DROP',
			label: '\u2587',
			testId: 'key-hard-drop',
		};

		render(
			<ArrowKeyGrid
				items={ITEMS as ArrowKeyGridItem<Direction | 'HARD_DROP'>[]}
				activeValue={null}
				bottomAction={bottom as ArrowKeyGridItem<Direction | 'HARD_DROP'>}
			/>,
		);

		expect(screen.getByTestId('key-hard-drop')).toBeInTheDocument();
	});

	it('applies active class to bottomAction when matching', () => {
		type Action = 'UP' | 'LEFT' | 'RIGHT' | 'DOWN' | 'HARD_DROP';
		const bottom: ArrowKeyGridItem<Action> = {
			value: 'HARD_DROP',
			label: '\u2587',
			testId: 'key-hard-drop',
		};

		render(
			<ArrowKeyGrid
				items={ITEMS as ArrowKeyGridItem<Action>[]}
				activeValue={'HARD_DROP' as Action}
				bottomAction={bottom}
			/>,
		);

		expect(screen.getByTestId('key-hard-drop').className).toContain('active');
	});

	it('adds gridWithBottom class when bottomAction is provided', () => {
		type Action = 'UP' | 'LEFT' | 'RIGHT' | 'DOWN' | 'HARD_DROP';
		const bottom: ArrowKeyGridItem<Action> = {
			value: 'HARD_DROP',
			label: '\u2587',
			testId: 'key-hard-drop',
		};

		render(
			<ArrowKeyGrid
				items={ITEMS as ArrowKeyGridItem<Action>[]}
				activeValue={null}
				bottomAction={bottom}
			/>,
		);

		expect(screen.getByTestId('arrow-key-grid').className).toContain('gridWithBottom');
	});

	it('does not add gridWithBottom class without bottomAction', () => {
		render(<ArrowKeyGrid items={ITEMS} activeValue={null} />);
		expect(screen.getByTestId('arrow-key-grid').className).not.toContain('gridWithBottom');
	});
});
