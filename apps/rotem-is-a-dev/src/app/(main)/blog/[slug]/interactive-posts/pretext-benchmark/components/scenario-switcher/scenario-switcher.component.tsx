'use client';

import { SCENARIOS } from '../../pretext-benchmark.constants';
import type { ScenarioId } from '../../pretext-benchmark.types';
import type { ScenarioSwitcherProps } from './scenario-switcher.types';
import styles from './scenario-switcher.module.scss';
import { ScenarioVirtual } from './scenarios/scenario-virtual.component';
import { ScenarioShrinkwrap } from './scenarios/scenario-shrinkwrap.component';
import { ScenarioMasonry } from './scenarios/scenario-masonry.component';
import { ScenarioTypography } from './scenarios/scenario-typography.component';

const SCENARIO_PANELS = {
	virtual: ScenarioVirtual,
	shrinkwrap: ScenarioShrinkwrap,
	masonry: ScenarioMasonry,
	justification: ScenarioTypography,
} satisfies Record<ScenarioId, React.ComponentType>;

export function ScenarioSwitcher({ activeScenario, onSelectAction }: Readonly<ScenarioSwitcherProps>) {
	const ActivePanel = SCENARIO_PANELS[activeScenario];

	return (
		<>
			<div className={styles.grid}>
				{SCENARIOS.map(scenario => {
					const isActive = scenario.id === activeScenario;

					return (
						<button
							key={scenario.id}
							className={`${styles.card} ${isActive ? styles.active : ''}`}
							onClick={() => onSelectAction(scenario.id)}
							type="button"
						>
							<div className={styles.cardIcon}>{scenario.icon}</div>
							<div className={styles.cardTitle}>{scenario.title}</div>
							<div className={styles.cardDesc}>{scenario.description}</div>
						</button>
					);
				})}
			</div>
			<div className={styles.detail}>
				<ActivePanel />
			</div>
		</>
	);
}
