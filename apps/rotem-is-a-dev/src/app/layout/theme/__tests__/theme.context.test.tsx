import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { ThemeProvider, useThemeContext } from '../theme.context';
import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from '../theme.constants';

jest.mock('usehooks-ts', () => ({ useMediaQuery: jest.fn() }));

const mockUseMediaQuery = jest.mocked(useMediaQuery);
const mockGetItem = jest.mocked(localStorage.getItem);
const mockSetItem = jest.mocked(localStorage.setItem);

const wrapper = ({ children }: { children: ReactNode }) => (
	<ThemeProvider>{children}</ThemeProvider>
);

const renderThemeHook = () => renderHook(() => useThemeContext(), { wrapper });

beforeEach(() => {
	mockGetItem.mockReset();
	mockSetItem.mockReset();
	mockUseMediaQuery.mockReturnValue(false);
	document.documentElement.removeAttribute(THEME_ATTRIBUTE);
});

describe('ThemeProvider', () => {
	it('starts on the system default with no attribute set', () => {
		const { result } = renderThemeHook();

		expect(result.current.theme).toBe('system');
		expect(result.current.isThemeDefault).toBe(true);
		expect(document.documentElement.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
	});

	it('resolves system to dark when the OS prefers dark', () => {
		mockUseMediaQuery.mockReturnValue(true);

		const { result } = renderThemeHook();

		expect(result.current.resolvedTheme).toBe('dark');
	});

	it('resolves system to light when the OS prefers light', () => {
		const { result } = renderThemeHook();

		expect(result.current.resolvedTheme).toBe('light');
	});

	it('applies and persists an explicit choice', () => {
		const { result } = renderThemeHook();

		act(() => result.current.selectTheme('dark'));

		expect(result.current.theme).toBe('dark');
		expect(result.current.isThemeDefault).toBe(false);
		expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
		expect(mockSetItem).toHaveBeenCalledWith(
			THEME_STORAGE_KEY,
			JSON.stringify('dark'),
		);
	});

	it('restores a stored theme on mount', () => {
		mockGetItem.mockReturnValue(JSON.stringify('light'));

		const { result } = renderThemeHook();

		expect(result.current.theme).toBe('light');
		expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('light');
	});

	it('toggles from a resolved dark theme to an explicit light one', () => {
		mockUseMediaQuery.mockReturnValue(true);
		const { result } = renderThemeHook();

		act(() => result.current.toggleTheme());

		expect(result.current.theme).toBe('light');
		expect(result.current.resolvedTheme).toBe('light');
	});

	it('toggles a system default straight to an explicit choice', () => {
		const { result } = renderThemeHook();
		expect(result.current.theme).toBe('system');

		act(() => result.current.toggleTheme());

		expect(result.current.theme).toBe('dark');
	});

	it('toggles back and forth between the explicit themes', () => {
		const { result } = renderThemeHook();

		act(() => result.current.selectTheme('dark'));
		act(() => result.current.toggleTheme());
		expect(result.current.theme).toBe('light');

		act(() => result.current.toggleTheme());
		expect(result.current.theme).toBe('dark');
	});

	it('returns to the system default on reset', () => {
		const { result } = renderThemeHook();

		act(() => result.current.selectTheme('light'));
		act(() => result.current.resetTheme());

		expect(result.current.theme).toBe('system');
		expect(document.documentElement.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
	});
});

describe('useThemeContext', () => {
	it('throws when used outside the provider', () => {
		const consoleError = jest
			.spyOn(console, 'error')
			.mockImplementation(() => undefined);

		expect(() => renderHook(() => useThemeContext())).toThrow(
			'useThemeContext must be used within ThemeProvider',
		);

		consoleError.mockRestore();
	});
});
