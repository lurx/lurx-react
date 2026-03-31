import { DECISION_ROWS } from '../../pretext-benchmark.constants';
import styles from './decision-table.module.scss';

const VERDICT_LABELS = {
	yes: 'YES',
	no: 'NO',
	maybe: 'TEST FIRST',
} as const;

export function DecisionTable() {
	return (
		<table className={styles.table}>
			<thead>
				<tr>
					<th>Scenario</th>
					<th>Use Pretext?</th>
					<th>Notes</th>
				</tr>
			</thead>
			<tbody>
				{DECISION_ROWS.map(row => (
					<tr key={row.scenario}>
						<td>{row.scenario}</td>
						<td>
							<span className={`${styles.badge} ${styles[row.verdict]}`}>
								{VERDICT_LABELS[row.verdict]}
							</span>
						</td>
						<td>{row.notes}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
