import { formatDate } from '../format-date.util';

describe('formatDate', () => {
	it('formats a date string to en-US long format', () => {
		const result = formatDate('2024-06-15');
		expect(result).toContain('June');
		expect(result).toContain('2024');
	});

	it('includes the day in the output', () => {
		const result = formatDate('2024-06-15');
		expect(result).toContain('15');
	});

	it('formats January correctly', () => {
		const result = formatDate('2023-01-01');
		expect(result).toContain('January');
		expect(result).toContain('2023');
	});
});
