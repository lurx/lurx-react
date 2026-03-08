import { getSocialButtonIconGroup } from '../social-actions-bar.helpers';

describe('getSocialButtonIconGroup', () => {
	it('returns "fas" when active', () => {
		expect(getSocialButtonIconGroup(true)).toBe('fas');
	});

	it('returns "fal" when inactive', () => {
		expect(getSocialButtonIconGroup(false)).toBe('fal');
	});
});
