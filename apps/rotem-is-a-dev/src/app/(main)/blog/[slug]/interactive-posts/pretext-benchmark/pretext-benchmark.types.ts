export type BenchmarkResult = {
	label: string;
	timeMs: number;
	color: string;
};

export type ScenarioId = 'virtual' | 'shrinkwrap' | 'masonry' | 'justification';

export type ScenarioCard = {
	id: ScenarioId;
	icon: string;
	title: string;
	description: string;
};

export type DecisionRow = {
	scenario: string;
	verdict: 'yes' | 'no' | 'maybe';
	notes: string;
};
