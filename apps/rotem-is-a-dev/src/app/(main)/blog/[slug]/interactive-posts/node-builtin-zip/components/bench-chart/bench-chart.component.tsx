'use client';

import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { BENCH_SOURCE, READ_ALL_ROWS, READ_ALL_SERIES, WRITE_ROWS, WRITE_SERIES } from '../../node-builtin-zip.constants';
import type { BenchChartProps, BenchSeries } from '../../node-builtin-zip.types';
import { formatMs, formatMsLabel } from './bench-chart.helpers';
import { AXIS_FONT_SIZE, BAR_GAP, BAR_SIZE, CHART_PADDING_BLOCK, LABEL_AXIS_WIDTH, ROW_PADDING, VALUE_LABEL_OFFSET } from './bench-chart.constants';
import styles from './bench-chart.module.scss';

const axisTickStyle = { fill: 'var(--muted)', fontSize: AXIS_FONT_SIZE };
const labelTickStyle = { fill: 'var(--text)', fontSize: AXIS_FONT_SIZE };
const valueLabelStyle = { fill: 'var(--text)', fontSize: AXIS_FONT_SIZE };
const legendStyle = { color: 'var(--muted)', fontSize: AXIS_FONT_SIZE };

function renderBar(series: BenchSeries) {
	return (
		<Bar key={series.key} dataKey={series.key} name={series.name} fill={series.color} barSize={BAR_SIZE} isAnimationActive={false}>
			<LabelList dataKey={series.key} position="right" offset={VALUE_LABEL_OFFSET} formatter={formatMsLabel} style={valueLabelStyle} />
		</Bar>
	);
}

export function BenchChart({ title, series, rows, unit, height }: Readonly<BenchChartProps>) {
	const rowHeight = series.length * (BAR_SIZE + BAR_GAP) + ROW_PADDING;
	const chartHeight = height ?? rows.length * rowHeight + CHART_PADDING_BLOCK * 2;
	const hasLegend = series.length > 1;
	const data = rows.map((row) => ({ ...row }));

	const renderLegend = () => {
		if (!hasLegend) return null;

		return <Legend wrapperStyle={legendStyle} iconType="square" iconSize={10} />;
	};

	return (
		<figure className={styles.figure}>
			<figcaption className={styles.title}>{title}</figcaption>
			<div className={styles.chart} role="img" aria-label={`${title}. ${rows.map((row) => `${row.label}: ${series.map((item) => `${item.name} ${formatMs(Number(row[item.key]))}`).join(', ')}`).join('; ')}.`}>
				<ResponsiveContainer width="100%" height={chartHeight}>
					<BarChart data={data} layout="vertical" barGap={BAR_GAP} margin={{ top: 4, right: 80, bottom: 4, left: 0 }}>
						<CartesianGrid horizontal={false} stroke="var(--border-dim)" strokeDasharray="3 3" />
						<XAxis type="number" tick={axisTickStyle} axisLine={false} tickLine={false} unit={` ${unit}`} />
						<YAxis type="category" dataKey="label" width={LABEL_AXIS_WIDTH} tick={labelTickStyle} axisLine={false} tickLine={false} />
						{renderLegend()}
						{series.map(renderBar)}
					</BarChart>
				</ResponsiveContainer>
			</div>
			<p className={styles.caption}>{BENCH_SOURCE}</p>
		</figure>
	);
}

export function ReadAllChart() {
	return <BenchChart title="Read every entry into memory, median (lower is better)" series={READ_ALL_SERIES} rows={READ_ALL_ROWS} unit="ms" />;
}

export function WriteChart() {
	return <BenchChart title="Write a 100 MB archive, median (lower is better)" series={WRITE_SERIES} rows={WRITE_ROWS} unit="ms" />;
}
