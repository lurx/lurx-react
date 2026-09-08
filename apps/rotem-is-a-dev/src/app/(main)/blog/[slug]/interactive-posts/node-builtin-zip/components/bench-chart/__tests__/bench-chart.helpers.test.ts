import { formatMs, formatMsLabel } from '../bench-chart.helpers';

describe('formatMs', () => {
	it('shows one decimal under 10 ms', () => {
		expect(formatMs(0.74)).toBe('0.7 ms');
		expect(formatMs(9.99)).toBe('10.0 ms');
	});

	it('rounds to whole milliseconds from 10 ms up', () => {
		expect(formatMs(13.26)).toBe('13 ms');
		expect(formatMs(999.4)).toBe('999 ms');
	});

	it('groups thousands so close values stay distinguishable', () => {
		expect(formatMs(2087)).toBe('2,087 ms');
		expect(formatMs(2129)).toBe('2,129 ms');
		expect(formatMs(4663)).toBe('4,663 ms');
	});
});

describe('formatMsLabel', () => {
	it('coerces whatever recharts hands over before formatting', () => {
		expect(formatMsLabel('2087')).toBe('2,087 ms');
		expect(formatMsLabel(13.26)).toBe('13 ms');
	});
});
