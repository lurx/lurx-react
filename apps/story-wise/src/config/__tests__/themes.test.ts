import { AVAILABLE_THEMES, DEFAULT_THEME, type ThemeName } from '../themes';

describe('themes', () => {
	it('AVAILABLE_THEMES includes winter and dim', () => {
		expect(AVAILABLE_THEMES).toContain('winter');
		expect(AVAILABLE_THEMES).toContain('dim');
		expect(AVAILABLE_THEMES).toHaveLength(2);
	});

	it('DEFAULT_THEME is dim', () => {
		expect(DEFAULT_THEME).toBe('dim');
	});

	it('ThemeName is union of theme names', () => {
		const t: ThemeName = 'winter';
		expect(AVAILABLE_THEMES).toContain(t);
	});
});
