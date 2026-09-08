import React from 'react';
import { render, screen } from '@testing-library/react';
import { BenchChart, ReadAllChart, WriteChart } from '../bench-chart.component';
import type { BenchRow, BenchSeries } from '../../../node-builtin-zip.types';

// ResponsiveContainer measures the DOM, which jsdom cannot do; give it a fixed box.
const receivedHeights: number[] = [];

jest.mock('recharts', () => {
	const actual = jest.requireActual<typeof import('recharts')>('recharts');
	const Fixed = ({ children, height }: { children: React.ReactElement; height: number }) => {
		receivedHeights.push(height);

		return <actual.ResponsiveContainer width={800} height={400}>{children}</actual.ResponsiveContainer>;
	};

	return { ...actual, ResponsiveContainer: Fixed };
});

const series = [
	{ key: 'first', name: 'series a', color: 'var(--orange)' },
	{ key: 'second', name: 'series b', color: 'var(--teal)' },
] as const satisfies readonly BenchSeries[];

const rows = [
	{ label: 'row one', first: 12.4, second: 1500 },
	{ label: 'row two', first: 3.21, second: 42 },
] as const satisfies readonly BenchRow[];

describe('BenchChart', () => {
	it('renders the title as the figure caption', () => {
		render(<BenchChart title="A title" series={series} rows={rows} unit="ms" />);

		expect(screen.getByText('A title')).toBeInTheDocument();
	});

	it('describes every row and series for assistive tech', () => {
		render(<BenchChart title="A title" series={series} rows={rows} unit="ms" />);

		expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'A title. row one: series a 12 ms, series b 1,500 ms; row two: series a 3.2 ms, series b 42 ms.');
	});

	it('renders one legend entry per series when there is more than one', () => {
		render(<BenchChart title="A title" series={series} rows={rows} unit="ms" />);

		expect(screen.getByText('series a')).toBeInTheDocument();
		expect(screen.getByText('series b')).toBeInTheDocument();
	});

	it('omits the legend for a single series', () => {
		render(<BenchChart title="Solo" series={[series[0]]} rows={rows} unit="ms" />);

		expect(screen.queryByText('series a')).not.toBeInTheDocument();
	});

	it('uses shorter rows when there is one bar per row', () => {
		render(<BenchChart title="Solo" series={[series[0]]} rows={rows} unit="ms" />);

		// 2 rows x (1 bar x (18 + 4) + 16) + 24 x 2
		expect(receivedHeights.at(-1)).toBe(2 * 38 + 48);
	});

	it('respects an explicit height', () => {
		render(<BenchChart title="Tall" series={series} rows={rows} unit="ms" height={321} />);

		expect(receivedHeights.at(-1)).toBe(321);
	});

	it('derives the height from the row count when none is given', () => {
		render(<BenchChart title="Auto" series={series} rows={rows} unit="ms" />);

		// 2 rows x (2 bars x (18 + 4) + 16) + 24 x 2
		expect(receivedHeights.at(-1)).toBe(2 * 60 + 48);
	});
});

describe('preset charts', () => {
	it('ReadAllChart renders the read-all title', () => {
		render(<ReadAllChart />);

		expect(screen.getByText(/Read every entry into memory/)).toBeInTheDocument();
	});

	it('WriteChart renders the write title', () => {
		render(<WriteChart />);

		expect(screen.getByText(/Write a 100 MB archive/)).toBeInTheDocument();
	});
});
