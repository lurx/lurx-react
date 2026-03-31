import { render, screen, fireEvent, act } from '@testing-library/react';
import type { BenchmarkResults } from '../../../pretext-benchmark.helpers';

const mockRunMainBenchmark = jest.fn();
const mockGetMainBenchmarkSource = jest.fn();

jest.mock('../../../pretext-benchmark.helpers', () => ({
	runMainBenchmark: (...args: unknown[]) => mockRunMainBenchmark(...args),
	getMainBenchmarkSource: (...args: unknown[]) => mockGetMainBenchmarkSource(...args),
}));

jest.mock('../../benchmark-widget', () => ({
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	BenchmarkWidget: (props: any) => (
		<div data-testid="benchmark-widget">
			<span data-testid="widget-title">{String(props.title)}</span>
			<span data-testid="widget-status">{String(props.status)}</span>
			<span data-testid="widget-description">{String(props.description ?? '')}</span>
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

import { MainBenchmark } from '../main-benchmark.component';

describe('MainBenchmark', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
		mockGetMainBenchmarkSource.mockReturnValue('mock source code');
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('renders BenchmarkWidget with initial state', () => {
		render(<MainBenchmark />);

		expect(screen.getByTestId('benchmark-widget')).toBeInTheDocument();
		expect(screen.getByTestId('widget-title')).toHaveTextContent('Text Height Prediction');
		expect(screen.getByTestId('widget-status')).toHaveTextContent('Click Run to start');
		expect(screen.getByTestId('widget-is-running')).toHaveTextContent('false');
		expect(screen.getByTestId('widget-item-count')).toHaveTextContent('500');
		expect(screen.getByTestId('widget-show-source')).toHaveTextContent('false');
	});

	it('renders with description text', () => {
		render(<MainBenchmark />);

		expect(screen.getByTestId('widget-description')).toHaveTextContent('Mixed paragraphs');
	});

	it('passes source code from getMainBenchmarkSource', () => {
		mockGetMainBenchmarkSource.mockReturnValue('benchmark source');

		render(<MainBenchmark />);

		expect(mockGetMainBenchmarkSource).toHaveBeenCalledWith(500);
		expect(screen.getByTestId('widget-source-code')).toHaveTextContent('benchmark source');
	});

	it('sets isRunning to true when run is triggered', () => {
		render(<MainBenchmark />);

		fireEvent.click(screen.getByTestId('run-btn'));

		expect(screen.getByTestId('widget-is-running')).toHaveTextContent('true');
		expect(screen.getByTestId('widget-status')).toHaveTextContent('Running benchmark with 500 items');
	});

	it('calls runMainBenchmark and updates results after rAF + setTimeout', () => {
		const mockResults: BenchmarkResults = {
			domInterleaved: 15.5,
			domBatched: 8.2,
			prepare: 3.1,
			layout: 0.45,
		};
		mockRunMainBenchmark.mockReturnValue(mockResults);

		render(<MainBenchmark />);

		fireEvent.click(screen.getByTestId('run-btn'));

		// Flush requestAnimationFrame
		act(() => {
			jest.runAllTimers();
		});

		expect(mockRunMainBenchmark).toHaveBeenCalledWith(500);
		expect(screen.getByTestId('widget-is-running')).toHaveTextContent('false');
		expect(screen.getByTestId('widget-status')).toHaveTextContent('Done (500 items)');
	});

	it('updates item count when onItemCountChangeAction is called', () => {
		render(<MainBenchmark />);

		fireEvent.change(screen.getByTestId('count-select'), { target: { value: '1000' } });

		expect(screen.getByTestId('widget-item-count')).toHaveTextContent('1000');
	});

	it('toggles showSource when toggle source button is clicked', () => {
		render(<MainBenchmark />);

		expect(screen.getByTestId('widget-show-source')).toHaveTextContent('false');

		fireEvent.click(screen.getByTestId('toggle-source-btn'));

		expect(screen.getByTestId('widget-show-source')).toHaveTextContent('true');

		fireEvent.click(screen.getByTestId('toggle-source-btn'));

		expect(screen.getByTestId('widget-show-source')).toHaveTextContent('false');
	});

	it('formats sub-millisecond results in microseconds', () => {
		const mockResults: BenchmarkResults = {
			domInterleaved: 15.5,
			domBatched: 8.2,
			prepare: 3.1,
			layout: 0.45,
		};
		mockRunMainBenchmark.mockReturnValue(mockResults);

		render(<MainBenchmark />);

		fireEvent.click(screen.getByTestId('run-btn'));

		act(() => {
			jest.runAllTimers();
		});

		// layout is 0.45ms which should be formatted as 450µs
		expect(screen.getByTestId('widget-status')).toHaveTextContent('450µs');
	});
});
