export type NodeBuiltinZipMdxProps = {
	code?: string;
};

export type BenchSeries = {
	key: string;
	name: string;
	color: string;
};

export type BenchRow = Record<string, string | number> & {
	label: string;
};

export type BenchChartProps = {
	title: string;
	series: readonly BenchSeries[];
	rows: readonly BenchRow[];
	unit: string;
	height?: number;
};
