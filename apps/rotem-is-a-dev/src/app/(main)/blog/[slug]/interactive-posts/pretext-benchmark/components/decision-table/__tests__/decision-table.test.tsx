import { render, screen } from '@testing-library/react';
import { DecisionTable } from '../decision-table.component';
import { DECISION_ROWS } from '../../../pretext-benchmark.constants';

describe('DecisionTable', () => {
	it('renders a table element', () => {
		render(<DecisionTable />);
		expect(screen.getByRole('table')).toBeInTheDocument();
	});

	it('renders the Scenario column header', () => {
		render(<DecisionTable />);
		expect(screen.getByText('Scenario')).toBeInTheDocument();
	});

	it('renders the Use Pretext? column header', () => {
		render(<DecisionTable />);
		expect(screen.getByText('Use Pretext?')).toBeInTheDocument();
	});

	it('renders the Notes column header', () => {
		render(<DecisionTable />);
		expect(screen.getByText('Notes')).toBeInTheDocument();
	});

	it('renders a row for every decision row', () => {
		render(<DecisionTable />);
		const dataRows = screen.getAllByRole('row');
		// +1 for the header row
		expect(dataRows).toHaveLength(DECISION_ROWS.length + 1);
	});

	it('renders each scenario text', () => {
		render(<DecisionTable />);
		for (const row of DECISION_ROWS) {
			expect(screen.getByText(row.scenario)).toBeInTheDocument();
		}
	});

	it('maps yes verdict to YES badge text', () => {
		render(<DecisionTable />);
		const yesCount = DECISION_ROWS.filter(row => row.verdict === 'yes').length;
		expect(screen.getAllByText('YES')).toHaveLength(yesCount);
	});

	it('maps no verdict to NO badge text', () => {
		render(<DecisionTable />);
		const noCount = DECISION_ROWS.filter(row => row.verdict === 'no').length;
		expect(screen.getAllByText('NO')).toHaveLength(noCount);
	});

	it('maps maybe verdict to TEST FIRST badge text', () => {
		render(<DecisionTable />);
		const maybeCount = DECISION_ROWS.filter(row => row.verdict === 'maybe').length;
		expect(screen.getAllByText('TEST FIRST')).toHaveLength(maybeCount);
	});

	it('applies the verdict CSS class to badge elements', () => {
		render(<DecisionTable />);
		const yesBadge = screen.getAllByText('YES')[0];
		expect(yesBadge.className).toContain('badge');
		expect(yesBadge.className).toContain('yes');
	});
});
