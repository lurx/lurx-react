export type ItemCount = 100 | 250 | 500 | 1000 | 2500 | 5000;

export type BenchmarkWidgetProps = {
	title: string;
	description?: string;
	rows: BenchmarkBarRow[];
	status: string;
	onRunAction: (count: ItemCount) => void;
	isRunning: boolean;
	sourceCode?: string;
	itemCount: ItemCount;
	onItemCountChangeAction: (count: ItemCount) => void;
	showSource: boolean;
	onToggleSourceAction: () => void;
};

export type BenchmarkBarRow = {
	label: string;
	value: string;
	percentage: number;
	color: string;
};
