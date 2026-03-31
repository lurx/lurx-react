import { render, screen, fireEvent, act } from '@testing-library/react';
import type { ResizeResults } from '../../../pretext-benchmark.helpers';

const mockRunResizeBenchmark = jest.fn();
const mockGetResizeBenchmarkSource = jest.fn();

jest.mock('../../../pretext-benchmark.helpers', () => ({
	runResizeBenchmark: (...args: unknown[]) => mockRunResizeBenchmark(...args),
	getResizeBenchmarkSource: (...args: unknown[]) => mockGetResizeBenchmarkSource(...args),
}));

jest.mock('../../benchmark-widget', () => ({
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	BenchmarkWidget: (props: any) => (
		<div data-testid="benchmark-widget">
			<span data-testid="widget-title">{String(props.title)}</span>
			<span data-testid="widget-status">{String(props.status)}</span>
			<span data-testid="widget-is-running">{String(props.isRunning)}</span>
			<span data-testid="widget-item-count">{String(props.itemCount)}</span>
			<span data-testid="widget-show-source">{String(props.showSource)}</span>
			<span data-testid="widget-source-code">{String(props.sourceCode ?? '')}</span>
			<button data-testid="run-btn" onClick={() => props.onRunAction(props.itemCount)}>Run</button>
			<button data-testid="toggle-source-btn" onClick={() => props.onToggleSourceAction()}>Toggle Source</button>
			<select data-testid="count-select" onChange={(ev) => props.onItemCountChangeAction(Number(ev.target.value))}>
				<option value="500">500</option>
				<option value="1000">1000</option>
			</select>
		</div>
	),
}));

import { ResizeBenchmark } from '../resize-benchmark.component';

describe('ResizeBenchmark', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
		mockGetResizeBenchmarkSource.mockReturnValue('resize source code');
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('renders BenchmarkWidget with initial state', () => {
		render(<ResizeBenchmark />);

		expect(screen.getByTestId('benchmark-widget')).toBeInTheDocument();
		expect(screen.getByTestId('widget-title')).toHaveTextContent('Resize Simulation');
		expect(screen.getByTestId('widget-status')).toHaveTextContent('Run the main benchmark first.');
		expect(screen.getByTestId('widget-is-running')).toHaveTextContent('false');
		expect(screen.getByTestId('widget-item-count')).toHaveTextContent('500');
		expect(screen.getByTestId('widget-show-source')).toHaveTextContent('false');
	});

	it('passes source code from getResizeBenchmarkSource', () => {
		mockGetResizeBenchmarkSource.mockReturnValue('resize source');

		render(<ResizeBenchmark />);

		expect(mockGetResizeBenchmarkSource).toHaveBeenCalledWith(500);
		expect(screen.getByTestId('widget-source-code')).toHaveTextContent('resize source');
	});

	it('sets isRunning to true when run is triggered', () => {
		render(<ResizeBenchmark />);

		fireEvent.click(screen.getByTestId('run-btn'));

		expect(screen.getByTestId('widget-is-running')).toHaveTextContent('true');
		expect(screen.getByTestId('widget-status')).toHaveTextContent('Running resize simulation with 500 items');
	});

	it('calls runResizeBenchmark and updates results after rAF + setTimeout', () => {
		const mockResults: ResizeResults = {
			domPerResize: 5.25,
			pretextPerResize: 0.12,
		};
		mockRunResizeBenchmark.mockReturnValue(mockResults);

		render(<ResizeBenchmark />);

		fireEvent.click(screen.getByTestId('run-btn'));

		act(() => {
			jest.runAllTimers();
		});

		expect(mockRunResizeBenchmark).toHaveBeenCalledWith(500);
		expect(screen.getByTestId('widget-is-running')).toHaveTextContent('false');
		expect(screen.getByTestId('widget-status')).toHaveTextContent('Done (500 items)');
	});

	it('formats results correctly in status text', () => {
		const mockResults: ResizeResults = {
			domPerResize: 5.25,
			pretextPerResize: 0.12,
		};
		mockRunResizeBenchmark.mockReturnValue(mockResults);

		render(<ResizeBenchmark />);

		fireEvent.click(screen.getByTestId('run-btn'));

		act(() => {
			jest.runAllTimers();
		});

		// 5.25ms stays as ms, 0.12ms becomes 120µs
		expect(screen.getByTestId('widget-status')).toHaveTextContent('5.25ms/resize');
		expect(screen.getByTestId('widget-status')).toHaveTextContent('120µs/resize');
	});

	it('updates item count when onItemCountChangeAction is called', () => {
		render(<ResizeBenchmark />);

		fireEvent.change(screen.getByTestId('count-select'), { target: { value: '1000' } });

		expect(screen.getByTestId('widget-item-count')).toHaveTextContent('1000');
	});

	it('toggles showSource when toggle source button is clicked', () => {
		render(<ResizeBenchmark />);

		expect(screen.getByTestId('widget-show-source')).toHaveTextContent('false');

		fireEvent.click(screen.getByTestId('toggle-source-btn'));

		expect(screen.getByTestId('widget-show-source')).toHaveTextContent('true');
	});
});
