import { render, screen, waitFor } from '@testing-library/react';
import type { ShrinkwrapResult } from '../shrinkwrap-demo.helpers';

const MOCK_RESULTS: ShrinkwrapResult[] = [
	{ text: 'Message one', fitContentWidth: 280, shrinkwrapWidth: 240, lineCount: 2, wastePercent: 14 },
	{ text: 'Message two', fitContentWidth: 300, shrinkwrapWidth: 290, lineCount: 3, wastePercent: 3 },
	{ text: 'Message three', fitContentWidth: 260, shrinkwrapWidth: 260, lineCount: 1, wastePercent: 0 },
];

const mockComputeShrinkwrap = jest.fn().mockReturnValue(MOCK_RESULTS);

jest.mock('../shrinkwrap-demo.helpers', () => ({
	__esModule: true,
	computeShrinkwrap: (...args: unknown[]) => mockComputeShrinkwrap(...args),
}));

import { ScenarioShrinkwrap } from '../scenario-shrinkwrap.component';

describe('ScenarioShrinkwrap', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the heading', () => {
		render(<ScenarioShrinkwrap />);

		expect(screen.getByText('Chat bubble shrinkwrap')).toBeInTheDocument();
	});

	it('renders description paragraphs', () => {
		render(<ScenarioShrinkwrap />);

		expect(screen.getByText(/width: fit-content/)).toBeInTheDocument();
		expect(screen.getByText(/binary-search/)).toBeInTheDocument();
	});

	it('renders the compare pane headers', () => {
		render(<ScenarioShrinkwrap />);

		expect(screen.getByText('CSS fit-content')).toBeInTheDocument();
		expect(screen.getByText('Pretext shrinkwrap')).toBeInTheDocument();
	});

	it('renders message texts in both panes', () => {
		render(<ScenarioShrinkwrap />);

		// Each message appears twice (once in each pane)
		const firstMessages = screen.getAllByText(/did you see the new pretext library/);
		expect(firstMessages.length).toBeGreaterThanOrEqual(2);
	});

	it('renders bubble demos after dynamic import resolves', async () => {
		render(<ScenarioShrinkwrap />);

		await waitFor(() => {
			expect(mockComputeShrinkwrap).toHaveBeenCalled();
		});

		expect(mockComputeShrinkwrap).toHaveBeenCalledWith([
			'Hey, did you see the new pretext library? It does text measurement without touching the DOM at all',
			'Yeah I saw it! The prepare/layout split is really clever for virtualised lists',
			'Exactly. And the hot path is pure arithmetic — no canvas calls, no reflows',
		]);
	});

	it('shows waste percentages after results load', async () => {
		render(<ScenarioShrinkwrap />);

		await waitFor(() => {
			expect(screen.getByText(/14%/)).toBeInTheDocument();
		});

		expect(screen.getByText(/3%/)).toBeInTheDocument();
	});

	it('shows shrinkwrap widths in footnote after results load', async () => {
		render(<ScenarioShrinkwrap />);

		await waitFor(() => {
			expect(screen.getByText(/240px/)).toBeInTheDocument();
		});

		expect(screen.getByText(/290px/)).toBeInTheDocument();
		expect(screen.getByText(/260px/)).toBeInTheDocument();
	});

	it('shows fit-content widths in footnote after results load', async () => {
		render(<ScenarioShrinkwrap />);

		await waitFor(() => {
			expect(screen.getByText(/280px/)).toBeInTheDocument();
		});

		expect(screen.getByText(/300px/)).toBeInTheDocument();
	});

	it('renders the verdict callout', () => {
		render(<ScenarioShrinkwrap />);

		expect(screen.getByText(/CSS literally cannot do this/)).toBeInTheDocument();
	});

	it('does not render waste markers for zero-waste results', async () => {
		render(<ScenarioShrinkwrap />);

		await waitFor(() => {
			expect(mockComputeShrinkwrap).toHaveBeenCalled();
		});

		// The third message has 0% waste, so only 2 waste markers should appear
		const wasteLabel = screen.getByText(/wasted space/i);
		// The waste label shows all percentages including 0%
		expect(wasteLabel).toHaveTextContent('14%');
		expect(wasteLabel).toHaveTextContent('3%');
		expect(wasteLabel).toHaveTextContent('0%');
	});
});
