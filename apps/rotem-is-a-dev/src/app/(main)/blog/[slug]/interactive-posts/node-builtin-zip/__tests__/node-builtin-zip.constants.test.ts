import { READ_ALL_ROWS, READ_ALL_SERIES, WRITE_ROWS, WRITE_SERIES } from '../node-builtin-zip.constants';

describe('node-builtin-zip constants', () => {
	it('every read-all row carries a value for every series', () => {
		for (const row of READ_ALL_ROWS) {
			for (const series of READ_ALL_SERIES) expect(typeof row[series.key]).toBe('number');
		}
	});

	it('every write row carries a value for every series', () => {
		for (const row of WRITE_ROWS) {
			for (const series of WRITE_SERIES) expect(typeof row[series.key]).toBe('number');
		}
	});

	it('write rows are sorted fastest first', () => {
		const values = WRITE_ROWS.map((row) => row.fewLarge);

		expect([...values].sort((left, right) => left - right)).toEqual(values);
	});
});
