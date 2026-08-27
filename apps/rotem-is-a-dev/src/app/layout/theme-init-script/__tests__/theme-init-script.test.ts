import {
	DEFAULT_THEME,
	THEME_ATTRIBUTE,
	THEME_STORAGE_KEY,
} from '../../accessibility-widget/accessibility-widget.types';
import { THEME_INIT_SCRIPT } from '../theme-init-script.constants';

function runScript(): void {
	new Function(THEME_INIT_SCRIPT)();
}

const mockGetItem = jest.mocked(localStorage.getItem);

beforeEach(() => {
	mockGetItem.mockReset();
	document.documentElement.removeAttribute(THEME_ATTRIBUTE);
});

describe('THEME_INIT_SCRIPT', () => {
	it('applies a stored explicit theme before paint', () => {
		mockGetItem.mockReturnValue(JSON.stringify('light'));

		runScript();

		expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe(
			'light',
		);
		expect(mockGetItem).toHaveBeenCalledWith(THEME_STORAGE_KEY);
	});

	it('leaves the attribute off for the system default', () => {
		mockGetItem.mockReturnValue(JSON.stringify(DEFAULT_THEME));

		runScript();

		expect(document.documentElement.hasAttribute(THEME_ATTRIBUTE)).toBe(
			false,
		);
	});

	it('leaves the attribute off when nothing is stored', () => {
		mockGetItem.mockReturnValue(null);

		runScript();

		expect(document.documentElement.hasAttribute(THEME_ATTRIBUTE)).toBe(
			false,
		);
	});

	it('swallows unparseable stored data', () => {
		mockGetItem.mockReturnValue('{{bad json');

		expect(runScript).not.toThrow();
		expect(document.documentElement.hasAttribute(THEME_ATTRIBUTE)).toBe(
			false,
		);
	});
});
