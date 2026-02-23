import { NAV_ITEMS } from '../nav-items.constants';

describe('NAV_ITEMS', () => {
	it('contains the expected navigation items', () => {
		expect(NAV_ITEMS).toEqual([
			{ label: 'hello', href: '/', enabled: true },
			{ label: 'about-me', href: '/about-me', enabled: true },
			{ label: 'projects', href: '/projects', enabled: true },
		]);
	});

	it('has unique labels', () => {
		const labels = NAV_ITEMS.map(item => item.label);
		expect(new Set(labels).size).toBe(labels.length);
	});

	it('has unique hrefs', () => {
		const hrefs = NAV_ITEMS.map(item => item.href);
		expect(new Set(hrefs).size).toBe(hrefs.length);
	});
});
