import {
	applyTheme,
	oppositeTheme,
	readStoredTheme,
	resolveTheme,
} from '../theme.helpers';
import {
	DEFAULT_THEME,
	THEME_ATTRIBUTE,
	THEME_STORAGE_KEY,
} from '../theme.constants';

const mockGetItem = jest.mocked(localStorage.getItem);

beforeEach(() => {
	mockGetItem.mockReset();
	document.documentElement.removeAttribute(THEME_ATTRIBUTE);
});

describe('readStoredTheme', () => {
	it('returns the stored theme when it is a valid THEMES value', () => {
		mockGetItem.mockReturnValue(JSON.stringify('light'));
		expect(readStoredTheme()).toBe('light');
		expect(mockGetItem).toHaveBeenCalledWith(THEME_STORAGE_KEY);
	});

	it('returns DEFAULT_THEME when the stored value is not in THEMES', () => {
		mockGetItem.mockReturnValue(JSON.stringify('solarized'));
		expect(readStoredTheme()).toBe(DEFAULT_THEME);
	});

	it('returns DEFAULT_THEME when the stored string is unparseable JSON', () => {
		mockGetItem.mockReturnValue('{{bad json');
		expect(readStoredTheme()).toBe(DEFAULT_THEME);
	});

	it('returns DEFAULT_THEME when localStorage returns null', () => {
		mockGetItem.mockReturnValue(null);
		expect(readStoredTheme()).toBe(DEFAULT_THEME);
	});
});

describe('applyTheme', () => {
	it('sets the theme attribute for an explicit dark choice', () => {
		applyTheme('dark');
		expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
	});

	it('sets the theme attribute for an explicit light choice', () => {
		applyTheme('light');
		expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('light');
	});

	it('removes the attribute for the system default so the OS decides', () => {
		applyTheme('light');
		applyTheme(DEFAULT_THEME);
		expect(document.documentElement.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
	});
});

describe('resolveTheme', () => {
	it('follows the OS preference when the theme is system', () => {
		expect(resolveTheme('system', true)).toBe('dark');
		expect(resolveTheme('system', false)).toBe('light');
	});

	it('ignores the OS preference for an explicit choice', () => {
		expect(resolveTheme('light', true)).toBe('light');
		expect(resolveTheme('dark', false)).toBe('dark');
	});
});

describe('oppositeTheme', () => {
	it('flips between the two explicit themes', () => {
		expect(oppositeTheme('dark')).toBe('light');
		expect(oppositeTheme('light')).toBe('dark');
	});
});
