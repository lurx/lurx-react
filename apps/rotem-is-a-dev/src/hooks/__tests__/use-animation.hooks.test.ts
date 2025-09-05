import { act, renderHook } from '@testing-library/react';
import { useAnimationScope, useMotionPreferences } from '../use-animation.hooks';

// Mock the animation utilities
jest.mock('../../utils/animation.utils', () => ({
	getMotionPreferences: jest.fn(() => ({
		prefersReducedMotion: false,
		motionLevel: 'full' as const,
	})),
	shouldReduceMotion: jest.fn(() => false),
	startAnimationMonitoring: jest.fn(),
	stopAnimationMonitoring: jest.fn(),
}));

// Mock usehooks-ts
jest.mock('usehooks-ts', () => ({
	useMediaQuery: jest.fn(() => false),
	useLocalStorage: jest.fn(() => [null, jest.fn()]),
}));

// Mock AnimeJS
jest.mock('animejs', () => ({
	createScope: jest.fn(() => ({
		revert: jest.fn(),
	})),
}));

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: jest.fn((key: string) => store[key] || null),
		setItem: jest.fn((key: string, value: string) => {
			store[key] = value;
		}),
		clear: jest.fn(() => {
			store = {};
		}),
	};
})();

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
});

// Mock matchMedia
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

describe('Animation Hooks', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		localStorageMock.clear();

		// Reset mocks to their default values
		const { shouldReduceMotion } = require('../../utils/animation.utils');
		shouldReduceMotion.mockReturnValue(false);

		const { createScope } = require('animejs');
		createScope.mockReturnValue({
			revert: jest.fn(),
		});
	});

	describe('useMotionPreferences', () => {
		it('should return motion preferences', () => {
			const { result } = renderHook(() => useMotionPreferences());

			expect(result.current).toEqual({
				prefersReducedMotion: false,
				motionLevel: 'full',
				setMotionLevel: expect.any(Function),
			});
		});

		it('should update preferences when media query changes', () => {
			const { useMediaQuery } = require('usehooks-ts');

			// First render with reduced motion false
			useMediaQuery.mockReturnValue(false);
			const { result, rerender } = renderHook(() => useMotionPreferences());

			expect(result.current.motionLevel).toBe('full');

			// Simulate media query change to reduced motion
			useMediaQuery.mockReturnValue(true);
			rerender();

			expect(result.current.motionLevel).toBe('reduced');
		});

		it('should listen for custom preference changes', () => {
			const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent').mockImplementation(() => true);

			renderHook(() => useMotionPreferences());

			expect(dispatchEventSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'motion-preference-changed'
				})
			);
		});
	});

	describe('useAnimationScope', () => {
		it('should create and cleanup animation scope', () => {
			const mockSetup = jest.fn();
			const mockScope = { revert: jest.fn() };

			// Ensure shouldReduceMotion returns false so animation is allowed
			const { shouldReduceMotion } = require('../../utils/animation.utils');
			shouldReduceMotion.mockReturnValue(false);

			// Mock the createScope function
			const { createScope } = require('animejs');
			createScope.mockReturnValue(mockScope);

			const { result, unmount } = renderHook(() =>
				useAnimationScope(mockSetup, { autoCleanup: false }) // Use autoCleanup: false for testing
			);

			expect(createScope).toHaveBeenCalledWith({ root: document.body });
			expect(mockSetup).toHaveBeenCalledWith(mockScope);
			expect(result.current.scope).toBe(mockScope);

			// Manually call cleanup
			act(() => {
				result.current.cleanup();
			});
			expect(mockScope.revert).toHaveBeenCalled();

			unmount();
		});

		it('should respect motion preferences', () => {
			const { shouldReduceMotion } = require('../../utils/animation.utils');
			shouldReduceMotion.mockReturnValue(true);

			const mockSetup = jest.fn();

			renderHook(() =>
				useAnimationScope(mockSetup, { respectMotionPreference: true })
			);

			expect(mockSetup).not.toHaveBeenCalled();
		});

		it('should handle setup errors gracefully', () => {
			const mockSetup = jest.fn(() => {
				throw new Error('Animation setup error');
			});

			const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

			const { result } = renderHook(() => useAnimationScope(mockSetup));

			expect(consoleSpy).toHaveBeenCalledWith(
				'Error setting up animations:',
				expect.any(Error)
			);

			expect(result.current.scope).toBeNull();

			consoleSpy.mockRestore();
		});

		it('should provide manual cleanup function', () => {
			const mockSetup = jest.fn();
			const mockScope = { revert: jest.fn() };

			const { createScope } = require('animejs');
			createScope.mockReturnValue(mockScope);

			const { result } = renderHook(() =>
				useAnimationScope(mockSetup, { autoCleanup: false })
			);

			expect(result.current.scope).toBe(mockScope);

			act(() => {
				result.current.cleanup();
			});

			expect(mockScope.revert).toHaveBeenCalled();
		});
	});
});
