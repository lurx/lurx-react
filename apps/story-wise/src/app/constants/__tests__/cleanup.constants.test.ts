import { CLEANUP_DISPLAY_DAYS } from '../cleanup.constants';

describe('cleanup.constants', () => {
	it('CLEANUP_DISPLAY_DAYS is 7', () => {
		expect(CLEANUP_DISPLAY_DAYS).toBe(7);
	});
});
