import { render, screen, waitFor } from '@testing-library/react';
import type { TypographyResult } from '../typography-demo.helpers';

const mockCursor = { segmentIndex: 0, graphemeIndex: 0 };

const MOCK_RESULT: TypographyResult = {
	greedyLines: [
		{ text: 'The art of typography has', width: 200, start: mockCursor, end: mockCursor },
		{ text: 'always been about controlling', width: 210, start: mockCursor, end: mockCursor },
	],
	greedySpacings: [8.5, 6.2],
	optimalLines: [
		{ text: 'The art of typography', width: 190, start: mockCursor, end: mockCursor },
		{ text: 'has always been about', width: 195, start: mockCursor, end: mockCursor },
	],
	optimalSpacings: [4.1, 3.8],
	maxWidth: 300,
};

const mockComputeTypography = jest.fn().mockReturnValue(MOCK_RESULT);
const mockDrawJustifiedText = jest.fn();

jest.mock('../typography-demo.helpers', () => ({
	__esModule: true,
	TYPOGRAPHY_TEXT: 'The art of typography has always been about controlling the white space.',
	computeTypography: (...args: unknown[]) => mockComputeTypography(...args),
	drawJustifiedText: (...args: unknown[]) => mockDrawJustifiedText(...args),
}));

// Mock ResizeObserver
const mockResizeObserverDisconnect = jest.fn();
const mockResizeObserverObserve = jest.fn();

beforeAll(() => {
	global.ResizeObserver = jest.fn().mockImplementation((callback: ResizeObserverCallback) => {
		// Trigger the callback immediately with a mock entry
		setTimeout(() => {
			callback(
				[{ contentRect: { width: 600 } }] as unknown as ResizeObserverEntry[],
				{} as ResizeObserver,
			);
		}, 0);

		return {
			observe: mockResizeObserverObserve,
			disconnect: mockResizeObserverDisconnect,
			unobserve: jest.fn(),
		};
	});
});

// Mock Canvas API
const mockCanvasContext = {
	scale: jest.fn(),
	clearRect: jest.fn(),
	save: jest.fn(),
	translate: jest.fn(),
	restore: jest.fn(),
	fillText: jest.fn(),
	measureText: jest.fn().mockReturnValue({ width: 50 }),
	fillRect: jest.fn(),
	font: '',
	textBaseline: '',
	fillStyle: '',
};

beforeAll(() => {
	HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(mockCanvasContext);
});

import { ScenarioTypography } from '../scenario-typography.component';

describe('ScenarioTypography', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the heading', () => {
		render(<ScenarioTypography />);

		expect(screen.getByText('Typography: justification and text shaping')).toBeInTheDocument();
	});

	it('renders description paragraphs', () => {
		render(<ScenarioTypography />);

		expect(screen.getByText(/text-align: justify/)).toBeInTheDocument();
		expect(screen.getByText(/greedy line-breaking algorithm/)).toBeInTheDocument();
	});

	it('renders greedy and optimal pane labels', () => {
		render(<ScenarioTypography />);

		expect(screen.getByText('Greedy line-breaking (CSS default)')).toBeInTheDocument();
		expect(screen.getByText('Balanced line-breaking (via pretext)')).toBeInTheDocument();
	});

	it('renders two canvases with role img', () => {
		render(<ScenarioTypography />);

		const canvases = screen.getAllByRole('img');
		expect(canvases).toHaveLength(2);

		expect(canvases[0]).toHaveAttribute('aria-label', expect.stringContaining('greedy line-breaking'));
		expect(canvases[1]).toHaveAttribute('aria-label', expect.stringContaining('balanced line-breaking'));
	});

	it('renders accessibility text for screen readers', () => {
		render(<ScenarioTypography />);

		// The TYPOGRAPHY_TEXT is rendered in hidden paragraphs for accessibility
		const hiddenTexts = screen.getAllByText('The art of typography has always been about controlling the white space.');
		expect(hiddenTexts.length).toBeGreaterThanOrEqual(2);
	});

	it('renders the verdict callout', () => {
		render(<ScenarioTypography />);

		expect(screen.getByText(/Niche but powerful/)).toBeInTheDocument();
	});

	it('renders layoutWithLines description paragraph', () => {
		render(<ScenarioTypography />);

		expect(screen.getByText(/layoutWithLines\(\)/)).toBeInTheDocument();
	});

	it('sets up ResizeObserver on mount', () => {
		render(<ScenarioTypography />);

		expect(mockResizeObserverObserve).toHaveBeenCalled();
	});

	it('shows spacing footnotes after results load', async () => {
		render(<ScenarioTypography />);

		await waitFor(() => {
			expect(mockComputeTypography).toHaveBeenCalled();
		});

		await waitFor(() => {
			expect(screen.getByText(/Worst gap: 8.5px/)).toBeInTheDocument();
		});

		expect(screen.getByText(/Worst gap: 4.1px/)).toBeInTheDocument();
	});

	it('shows percentage tighter in optimal footnote', async () => {
		render(<ScenarioTypography />);

		await waitFor(() => {
			expect(screen.getByText(/tighter/)).toBeInTheDocument();
		});
	});
});
