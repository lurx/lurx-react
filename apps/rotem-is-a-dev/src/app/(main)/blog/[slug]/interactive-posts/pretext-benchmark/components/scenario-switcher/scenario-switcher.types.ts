import type { ScenarioId } from '../../pretext-benchmark.types';

export type ScenarioSwitcherProps = {
	activeScenario: ScenarioId;
	onSelectAction: (id: ScenarioId) => void;
};
