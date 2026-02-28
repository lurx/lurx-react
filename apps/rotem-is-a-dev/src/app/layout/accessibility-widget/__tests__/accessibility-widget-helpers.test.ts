import {
	applySpacing,
	applyTextScale,
	formatSpacingValue,
	getBaseFontSize,
	readStoredLevel,
	readStoredScale,
} from '../accessibility-widget.helpers';
import {
	BASE_FONT_SIZE_PX,
	DEFAULT_SPACING_LEVEL,
	DEFAULT_TEXT_SCALE,
	LETTER_SPACING_VALUES,
	LINE_HEIGHT_VALUES,
	MOBILE_BASE_FONT_SIZE_PX,
	MOBILE_BREAKPOINT_PX,
	TEXT_SCALE_STORAGE_KEY,
} from '../accessibility-widget.types';

const mockGetItem = jest.mocked(localStorage.getItem);

beforeEach(() => {
	mockGetItem.mockReset();
	document.documentElement.style.removeProperty('--root-font-size');
	document.documentElement.style.removeProperty('--a11y-line-height');
	document.documentElement.style.removeProperty('--a11y-letter-spacing');
});

describe('readStoredScale', () => {
	it('returns the stored scale when it is a valid TEXT_SCALES value', () => {
		mockGetItem.mockReturnValue(JSON.stringify(150));
		expect(readStoredScale()).toBe(150);
		expect(mockGetItem).toHaveBeenCalledWith(TEXT_SCALE_STORAGE_KEY);
	});

	it('returns DEFAULT_TEXT_SCALE when the stored value is not in TEXT_SCALES', () => {
		mockGetItem.mockReturnValue(JSON.stringify(999));
		expect(readStoredScale()).toBe(DEFAULT_TEXT_SCALE);
	});

	it('returns DEFAULT_TEXT_SCALE when the stored string is unparseable JSON', () => {
		mockGetItem.mockReturnValue('{{bad json');
		expect(readStoredScale()).toBe(DEFAULT_TEXT_SCALE);
	});

	it('returns DEFAULT_TEXT_SCALE when localStorage returns null', () => {
		mockGetItem.mockReturnValue(null);
		expect(readStoredScale()).toBe(DEFAULT_TEXT_SCALE);
	});
});

describe('readStoredLevel', () => {
	const storageKey = 'test-spacing-key';

	it('returns the stored level when it is a valid SpacingLevel (0–3)', () => {
		mockGetItem.mockReturnValue(JSON.stringify(2));
		expect(readStoredLevel(storageKey)).toBe(2);
		expect(mockGetItem).toHaveBeenCalledWith(storageKey);
	});

	it('returns DEFAULT_SPACING_LEVEL when the stored value is outside the valid range', () => {
		mockGetItem.mockReturnValue(JSON.stringify(99));
		expect(readStoredLevel(storageKey)).toBe(DEFAULT_SPACING_LEVEL);
	});

	it('returns DEFAULT_SPACING_LEVEL when the stored string is unparseable JSON', () => {
		mockGetItem.mockReturnValue('{{bad');
		expect(readStoredLevel(storageKey)).toBe(DEFAULT_SPACING_LEVEL);
	});
});

describe('getBaseFontSize', () => {
	it('returns MOBILE_BASE_FONT_SIZE_PX when matchMedia matches the mobile breakpoint', () => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation((query: string) => ({
				matches: true,
				media: query,
				onchange: null,
				addListener: jest.fn(),
				removeListener: jest.fn(),
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			})),
		});

		expect(getBaseFontSize()).toBe(MOBILE_BASE_FONT_SIZE_PX);
		expect(window.matchMedia).toHaveBeenCalledWith(
			`(max-width: ${MOBILE_BREAKPOINT_PX}px)`,
		);
	});

	it('returns BASE_FONT_SIZE_PX when matchMedia does not match the mobile breakpoint', () => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation((query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: jest.fn(),
				removeListener: jest.fn(),
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			})),
		});

		expect(getBaseFontSize()).toBe(BASE_FONT_SIZE_PX);
	});
});

describe('applyTextScale', () => {
	beforeEach(() => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation((query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: jest.fn(),
				removeListener: jest.fn(),
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			})),
		});
	});

	it('removes --root-font-size when scale equals DEFAULT_TEXT_SCALE', () => {
		document.documentElement.style.setProperty('--root-font-size', '20px');
		applyTextScale(DEFAULT_TEXT_SCALE);
		expect(
			document.documentElement.style.getPropertyValue('--root-font-size'),
		).toBe('');
	});

	it('sets --root-font-size to the calculated value when scale is non-default', () => {
		applyTextScale(175);
		const expectedFontSize = (BASE_FONT_SIZE_PX * 175) / 100;
		expect(
			document.documentElement.style.getPropertyValue('--root-font-size'),
		).toBe(`${expectedFontSize}px`);
	});
});

describe('applySpacing', () => {
	it('sets --a11y-line-height and --a11y-letter-spacing when levels are non-zero', () => {
		applySpacing(2, 3);
		expect(
			document.documentElement.style.getPropertyValue('--a11y-line-height'),
		).toBe(String(LINE_HEIGHT_VALUES[2]));
		expect(
			document.documentElement.style.getPropertyValue('--a11y-letter-spacing'),
		).toBe(`${LETTER_SPACING_VALUES[3]}em`);
	});

	it('removes --a11y-line-height when lineHeightLevel is 0', () => {
		document.documentElement.style.setProperty('--a11y-line-height', '1.75');
		applySpacing(0, 1);
		expect(
			document.documentElement.style.getPropertyValue('--a11y-line-height'),
		).toBe('');
	});

	it('removes --a11y-letter-spacing when letterSpacingLevel is 0', () => {
		document.documentElement.style.setProperty(
			'--a11y-letter-spacing',
			'0.05em',
		);
		applySpacing(1, 0);
		expect(
			document.documentElement.style.getPropertyValue('--a11y-letter-spacing'),
		).toBe('');
	});

	it('removes both properties when both levels are 0', () => {
		document.documentElement.style.setProperty('--a11y-line-height', '1.5');
		document.documentElement.style.setProperty(
			'--a11y-letter-spacing',
			'0.1em',
		);
		applySpacing(0, 0);
		expect(
			document.documentElement.style.getPropertyValue('--a11y-line-height'),
		).toBe('');
		expect(
			document.documentElement.style.getPropertyValue('--a11y-letter-spacing'),
		).toBe('');
	});
});

describe('formatSpacingValue', () => {
	it("returns 'Normal' when the value at the given level is 'Normal'", () => {
		expect(formatSpacingValue(LINE_HEIGHT_VALUES, 0, 'em')).toBe('Normal');
	});

	it('returns the numeric value concatenated with the suffix when the value is a number', () => {
		expect(formatSpacingValue(LETTER_SPACING_VALUES, 2, 'em')).toBe('0.1em');
	});

	it('appends the provided suffix to numeric values', () => {
		expect(formatSpacingValue([1.5, 2], 1, 'x')).toBe('2x');
	});
});
