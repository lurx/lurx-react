export type BenchmarkResult = {
	label: string;
	timeMs: number;
	color: string;
};

export type ScenarioId = 'virtual' | 'shrinkwrap' | 'masonry' | 'justification';

export type ScenarioCard = {
	id: ScenarioId;
	icon: IconData;
	title: string;
	description: string;
};

export type DecisionRow = {
	scenario: string;
	verdict: 'yes' | 'no' | 'maybe';
	notes: string;
};

export type ImpossibleThing = {
	icon: IconData;
	label: string;
	description: string;
};
