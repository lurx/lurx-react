import { SCENARIOS, DECISION_ROWS, IMPOSSIBLE_THINGS } from '../pretext-benchmark.constants';

describe('SCENARIOS', () => {
	it('contains 4 scenario cards', () => {
		expect(SCENARIOS).toHaveLength(4);
	});

	it('has virtual as the first scenario id', () => {
		expect(SCENARIOS[0].id).toBe('virtual');
	});

	it('has shrinkwrap as the second scenario id', () => {
		expect(SCENARIOS[1].id).toBe('shrinkwrap');
	});

	it('has masonry as the third scenario id', () => {
		expect(SCENARIOS[2].id).toBe('masonry');
	});

	it('has justification as the fourth scenario id', () => {
		expect(SCENARIOS[3].id).toBe('justification');
	});

	it('has title, description, and icon for every scenario', () => {
		for (const scenario of SCENARIOS) {
			expect(scenario.title).toBeTruthy();
			expect(scenario.description).toBeTruthy();
			expect(scenario.icon).toBeTruthy();
		}
	});
});

describe('DECISION_ROWS', () => {
	it('contains 11 decision rows', () => {
		expect(DECISION_ROWS).toHaveLength(11);
	});

	it('has yes verdicts', () => {
		const yesRows = DECISION_ROWS.filter(row => row.verdict === 'yes');
		expect(yesRows.length).toBeGreaterThan(0);
	});

	it('has no verdicts', () => {
		const noRows = DECISION_ROWS.filter(row => row.verdict === 'no');
		expect(noRows.length).toBeGreaterThan(0);
	});

	it('has maybe verdicts', () => {
		const maybeRows = DECISION_ROWS.filter(row => row.verdict === 'maybe');
		expect(maybeRows.length).toBeGreaterThan(0);
	});

	it('has scenario, verdict, and notes for every row', () => {
		for (const row of DECISION_ROWS) {
			expect(row.scenario).toBeTruthy();
			expect(row.verdict).toBeTruthy();
			expect(row.notes).toBeTruthy();
		}
	});

	it('only contains valid verdict values', () => {
		const validVerdicts = ['yes', 'no', 'maybe'];
		for (const row of DECISION_ROWS) {
			expect(validVerdicts).toContain(row.verdict);
		}
	});
});

describe('IMPOSSIBLE_THINGS', () => {
	it('contains 6 items', () => {
		expect(IMPOSSIBLE_THINGS).toHaveLength(6);
	});

	it('has icon, label, and description for every item', () => {
		for (const thing of IMPOSSIBLE_THINGS) {
			expect(thing.icon).toBeTruthy();
			expect(thing.label).toBeTruthy();
			expect(thing.description).toBeTruthy();
		}
	});

	it('includes MULTILINE SHRINKWRAP as a label', () => {
		const labels = IMPOSSIBLE_THINGS.map(thing => thing.label);
		expect(labels).toContain('MULTILINE SHRINKWRAP');
	});

	it('includes WORKER-SIDE LAYOUT as a label', () => {
		const labels = IMPOSSIBLE_THINGS.map(thing => thing.label);
		expect(labels).toContain('WORKER-SIDE LAYOUT');
	});
});
