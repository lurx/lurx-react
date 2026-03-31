import { render, screen, fireEvent } from '@testing-library/react';
import type { BenchmarkBarRow, ItemCount } from '../benchmark-widget.types';

jest.mock('@/app/components', () => ({
	CodeBlock: ({ code, language }: { code: string; language: string }) => (
		<pre data-testid="code-block" data-language={language}>{code}</pre>
	),
}));

import { BenchmarkWidget } from '../benchmark-widget.component';

const MOCK_ROWS: BenchmarkBarRow[] = [
	{ label: 'DOM interleaved', value: '12.50ms', percentage: 100, color: '#f87171' },
	{ label: 'Pretext layout()', value: '0.80ms', percentage: 6, color: '#4ade80' },
];

const DEFAULT_PROPS = {
	title: 'Test Benchmark',
	rows: MOCK_ROWS,
	status: 'Ready to run',
	onRunAction: jest.fn(),
	isRunning: false,
	itemCount: 500 as ItemCount,
	onItemCountChangeAction: jest.fn(),
	showSource: false,
	onToggleSourceAction: jest.fn(),
};

describe('BenchmarkWidget', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the title', () => {
		render(<BenchmarkWidget {...DEFAULT_PROPS} />);

		expect(screen.getByText('Test Benchmark')).toBeInTheDocument();
	});

	it('renders rows with labels and values', () => {
		render(<BenchmarkWidget {...DEFAULT_PROPS} />);

		expect(screen.getByText('DOM interleaved')).toBeInTheDocument();
		expect(screen.getByText('12.50ms')).toBeInTheDocument();
		expect(screen.getByText('Pretext layout()')).toBeInTheDocument();
		expect(screen.getByText('0.80ms')).toBeInTheDocument();
	});

	it('renders bars with correct width and color', () => {
		const { container } = render(<BenchmarkWidget {...DEFAULT_PROPS} />);

		const bars = container.querySelectorAll('[class*="bar"]');
		const barElements = Array.from(bars).filter(
			element => element.getAttribute('style')?.includes('width:') && element.getAttribute('style')?.includes('background-color'),
		);

		expect(barElements).toHaveLength(2);
		expect(barElements[0]).toHaveStyle({ backgroundColor: '#f87171', width: '100%' });
		expect(barElements[1]).toHaveStyle({ backgroundColor: '#4ade80', width: '6%' });
	});

	it('renders the status text', () => {
		render(<BenchmarkWidget {...DEFAULT_PROPS} />);

		expect(screen.getByText('Ready to run')).toBeInTheDocument();
	});

	it('renders the description when provided', () => {
		render(<BenchmarkWidget {...DEFAULT_PROPS} description="Test description" />);

		expect(screen.getByText('Test description')).toBeInTheDocument();
	});

	it('does not render a source toggle button when sourceCode is not provided', () => {
		render(<BenchmarkWidget {...DEFAULT_PROPS} />);

		expect(screen.queryByText('View Source')).not.toBeInTheDocument();
		expect(screen.queryByText('Hide Source')).not.toBeInTheDocument();
	});

	it('renders View Source button when sourceCode is provided and showSource is false', () => {
		render(<BenchmarkWidget {...DEFAULT_PROPS} sourceCode="const x = 1;" />);

		expect(screen.getByText('View Source')).toBeInTheDocument();
	});

	it('renders Hide Source button when showSource is true', () => {
		render(<BenchmarkWidget {...DEFAULT_PROPS} sourceCode="const x = 1;" showSource />);

		expect(screen.getByText('Hide Source')).toBeInTheDocument();
	});

	it('renders CodeBlock when showSource is true and sourceCode is provided', () => {
		render(<BenchmarkWidget {...DEFAULT_PROPS} sourceCode="const x = 1;" showSource />);

		expect(screen.getByTestId('code-block')).toBeInTheDocument();
		expect(screen.getByTestId('code-block')).toHaveTextContent('const x = 1;');
	});

	it('does not render CodeBlock when showSource is false', () => {
		render(<BenchmarkWidget {...DEFAULT_PROPS} sourceCode="const x = 1;" />);

		expect(screen.queryByTestId('code-block')).not.toBeInTheDocument();
	});

	it('calls onToggleSourceAction when source button is clicked', () => {
		const onToggleSourceAction = jest.fn();

		render(
			<BenchmarkWidget
				{...DEFAULT_PROPS}
				sourceCode="const x = 1;"
				onToggleSourceAction={onToggleSourceAction}
			/>,
		);

		fireEvent.click(screen.getByText('View Source'));

		expect(onToggleSourceAction).toHaveBeenCalledTimes(1);
	});

	it('renders the item count select with correct value', () => {
		render(<BenchmarkWidget {...DEFAULT_PROPS} />);

		const select = screen.getByRole('combobox');
		expect(select).toHaveValue('500');
	});

	it('renders all item count options', () => {
		render(<BenchmarkWidget {...DEFAULT_PROPS} />);

		const options = screen.getAllByRole('option');
		expect(options).toHaveLength(6);
		expect(options[0]).toHaveTextContent('100 items');
		expect(options[1]).toHaveTextContent('250 items');
		expect(options[2]).toHaveTextContent('500 items');
		expect(options[3]).toHaveTextContent('1,000 items');
		expect(options[4]).toHaveTextContent('2,500 items');
		expect(options[5]).toHaveTextContent('5,000 items');
	});

	it('calls onItemCountChangeAction when select changes', () => {
		const onItemCountChangeAction = jest.fn();

		render(
			<BenchmarkWidget
				{...DEFAULT_PROPS}
				onItemCountChangeAction={onItemCountChangeAction}
			/>,
		);

		fireEvent.change(screen.getByRole('combobox'), { target: { value: '1000' } });

		expect(onItemCountChangeAction).toHaveBeenCalledWith(1000);
	});

	it('calls onRunAction with itemCount when run button is clicked', () => {
		const onRunAction = jest.fn();

		render(<BenchmarkWidget {...DEFAULT_PROPS} onRunAction={onRunAction} />);

		fireEvent.click(screen.getByText('▶ Run'));

		expect(onRunAction).toHaveBeenCalledWith(500);
	});

	it('disables the run button when isRunning is true', () => {
		render(<BenchmarkWidget {...DEFAULT_PROPS} isRunning />);

		expect(screen.getByText('Running\u2026')).toBeDisabled();
	});

	it('disables the select when isRunning is true', () => {
		render(<BenchmarkWidget {...DEFAULT_PROPS} isRunning />);

		expect(screen.getByRole('combobox')).toBeDisabled();
	});

	it('shows Running text when isRunning is true', () => {
		render(<BenchmarkWidget {...DEFAULT_PROPS} isRunning />);

		expect(screen.getByText('Running\u2026')).toBeInTheDocument();
		expect(screen.queryByText('▶ Run')).not.toBeInTheDocument();
	});

	it('renders the run button as enabled when not running', () => {
		render(<BenchmarkWidget {...DEFAULT_PROPS} />);

		expect(screen.getByText('▶ Run')).not.toBeDisabled();
	});
});
