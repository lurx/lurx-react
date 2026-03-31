'use client';

import { useState } from 'react';
import type { ScenarioId } from '../../pretext-benchmark.types';
import { ScenarioSwitcher } from '../scenario-switcher';

export function MdxScenarioSwitcher() {
	const [activeScenario, setActiveScenario] = useState<ScenarioId>('virtual');

	return <ScenarioSwitcher activeScenario={activeScenario} onSelectAction={setActiveScenario} />;
}
