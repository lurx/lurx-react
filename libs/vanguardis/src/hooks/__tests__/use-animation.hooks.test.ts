import { act, renderHook } from '@testing-library/react';
import type {
	AnimationState,
	MotionPreferences,
} from '../../types/animation.types';
import {
	useAnimationScope,
	useAnimationState,
	useMotionPreferences,
	useMultipleAnimationScopes,
} from '../use-animation.hooks';

type ExtendedMotionPreferences = MotionPreferences & {
	setMotionLevel: (level: MotionPreferences['motionLevel']) => void;
};

type ExtendedAnimationState = AnimationState & {
	startAnimation: () => void;
	stopAnimation: () => void;
	updateProgress: (progress: number) => void;
};

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

// Mock animejs
jest.mock('animejs', () => ({
	createScope: jest.fn(() => ({
		revert: jest.fn(),
	})),
}));

// Mock usehooks-ts
jest.mock('usehooks-ts', () => ({
	useMediaQuery: jest.fn(() => false),
	useLocalStorage: jest.fn(() => [null, jest.fn()]),
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
		const mockUseMediaQuery = require('usehooks-ts').useMediaQuery;
		const mockUseLocalStorage = require('usehooks-ts').useLocalStorage;
		const mockDispatchEvent = jest.fn();

		beforeEach(() => {
			jest.clearAllMocks();

			Object.defineProperty(window, 'dispatchEvent', {
				value: mockDispatchEvent,
			});
		});

		it('should return motion preferences with default values', () => {
			mockUseMediaQuery.mockReturnValue(false);
			mockUseLocalStorage.mockReturnValue([null, jest.fn()]);

			const { result } = renderHook(() => useMotionPreferences());

			expect(result.current.prefersReducedMotion).toBe(false);
			expect(result.current.motionLevel).toBe('full');
			expect(
				typeof (result.current as ExtendedMotionPreferences).setMotionLevel,
			).toBe('function');
		});

		it('should return reduced motion when system preference is enabled', () => {
			mockUseMediaQuery.mockReturnValue(true);
			mockUseLocalStorage.mockReturnValue([null, jest.fn()]);

			const { result } = renderHook(() => useMotionPreferences());

			expect(result.current.prefersReducedMotion).toBe(true);
			expect(result.current.motionLevel).toBe('reduced');
		});

		it('should prioritize custom motion level over system preference', () => {
			mockUseMediaQuery.mockReturnValue(true);
			mockUseLocalStorage.mockReturnValue(['none', jest.fn()]);

			const { result } = renderHook(() => useMotionPreferences());

			expect(result.current.prefersReducedMotion).toBe(true);
			expect(result.current.motionLevel).toBe('none');
		});

		it('should dispatch event when motion level changes', () => {
			mockUseMediaQuery.mockReturnValue(false);
			const mockSetMotionLevel = jest.fn();
			mockUseLocalStorage.mockReturnValue(['full', mockSetMotionLevel]);

			renderHook(() => useMotionPreferences());

			expect(mockDispatchEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'motion-preference-changed',
					detail: { motionLevel: 'full' },
				}),
			);
		});

		it('should provide setMotionLevel function', () => {
			const mockSetMotionLevel = jest.fn();
			mockUseMediaQuery.mockReturnValue(false);
			mockUseLocalStorage.mockReturnValue([null, mockSetMotionLevel]);

			const { result } = renderHook(() => useMotionPreferences());
			act(() => {
				(result.current as ExtendedMotionPreferences).setMotionLevel('reduced');
			});

			expect(mockSetMotionLevel).toHaveBeenCalledWith('reduced');
		});

		it('should handle all motion levels correctly', () => {
			const mockSetMotionLevel = jest.fn();
			mockUseMediaQuery.mockReturnValue(false);

			// Test 'none' level
			mockUseLocalStorage.mockReturnValue(['none', mockSetMotionLevel]);
			const { result: result1 } = renderHook(() => useMotionPreferences());
			expect(result1.current.motionLevel).toBe('none');

			// Test 'reduced' level
			mockUseLocalStorage.mockReturnValue(['reduced', mockSetMotionLevel]);
			const { result: result2 } = renderHook(() => useMotionPreferences());
			expect(result2.current.motionLevel).toBe('reduced');

			// Test 'full' level
			mockUseLocalStorage.mockReturnValue(['full', mockSetMotionLevel]);
			const { result: result3 } = renderHook(() => useMotionPreferences());
			expect(result3.current.motionLevel).toBe('full');
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

			const { result, unmount } = renderHook(
				() => useAnimationScope(mockSetup, { autoCleanup: false }), // Use autoCleanup: false for testing
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
				useAnimationScope(mockSetup, { respectMotionPreference: true }),
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
				expect.any(Error),
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
				useAnimationScope(mockSetup, { autoCleanup: false }),
			);

			expect(result.current.scope).toBe(mockScope);

			act(() => {
				result.current.cleanup();
			});

			expect(mockScope.revert).toHaveBeenCalled();
		});
	});

	describe('error handling and edge cases', () => {
		it('should handle setup function errors gracefully', () => {
			const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
			const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

			const errorSetup = jest.fn().mockImplementation(() => {
				throw new Error('Setup error');
			});

			renderHook(() => useAnimationScope(errorSetup));

			expect(consoleSpy).toHaveBeenCalledWith(
				'Error setting up animations:',
				expect.any(Error),
			);

			// Should also try to clean up
			const { createScope } = require('animejs');
			const mockScope =
				createScope.mock.results[createScope.mock.results.length - 1]?.value;
			if (mockScope?.revert) {
				expect(mockScope.revert).toHaveBeenCalled();
			}

			consoleSpy.mockRestore();
			warnSpy.mockRestore();
		});

		it('should handle cleanup errors in error handler', () => {
			const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
			const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

			const errorSetup = jest.fn().mockImplementation(() => {
				throw new Error('Setup error');
			});

			// Make revert also throw an error
			const { createScope } = require('animejs');
			const mockScope = {
				revert: jest.fn().mockImplementation(() => {
					throw new Error('Cleanup error');
				}),
			};
			createScope.mockReturnValue(mockScope);

			renderHook(() => useAnimationScope(errorSetup));

			expect(consoleSpy).toHaveBeenCalledWith(
				'Error setting up animations:',
				expect.any(Error),
			);
			expect(warnSpy).toHaveBeenCalledWith(
				'Error cleaning up animation scope:',
				expect.any(Error),
			);

			consoleSpy.mockRestore();
			warnSpy.mockRestore();
		});

		it('should handle cleanup errors gracefully', () => {
			const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
			const setup = jest.fn();

			// Make revert throw an error
			const { createScope } = require('animejs');
			const mockScope = {
				revert: jest.fn().mockImplementation(() => {
					throw new Error('Cleanup error');
				}),
			};
			createScope.mockReturnValue(mockScope);

			const { unmount } = renderHook(() =>
				useAnimationScope(setup, { autoCleanup: true }),
			);

			unmount();

			expect(warnSpy).toHaveBeenCalledWith(
				'Error cleaning up animation scope:',
				expect.any(Error),
			);

			warnSpy.mockRestore();
		});

		it('should handle performance monitoring with enablePerformanceMonitoring', () => {
			const setup = jest.fn();
			const {
				startAnimationMonitoring,
			} = require('../../utils/animation.utils');

			renderHook(() =>
				useAnimationScope(setup, { enablePerformanceMonitoring: true }),
			);

			expect(startAnimationMonitoring).toHaveBeenCalledWith(
				expect.stringMatching(/^animation-\d+-/),
			);
		});

		it('should stop performance monitoring on cleanup', () => {
			const setup = jest.fn();
			const {
				stopAnimationMonitoring,
			} = require('../../utils/animation.utils');

			const { unmount } = renderHook(() =>
				useAnimationScope(setup, {
					autoCleanup: true,
					enablePerformanceMonitoring: true,
				}),
			);

			unmount();

			expect(stopAnimationMonitoring).toHaveBeenCalled();
		});

		it('should handle options changes correctly', () => {
			const setup = jest.fn();

			const { rerender } = renderHook(
				props => useAnimationScope(setup, props),
				{ initialProps: { autoCleanup: false } },
			);

			// Change options
			rerender({ autoCleanup: true });

			// Should create new scope
			expect(setup).toHaveBeenCalledTimes(2);
		});

		it('should handle respectMotionPreference option', () => {
			const { shouldReduceMotion } = require('../../utils/animation.utils');
			shouldReduceMotion.mockReturnValue(true);
			const setup = jest.fn();

			renderHook(() =>
				useAnimationScope(setup, { respectMotionPreference: true }),
			);

			expect(setup).not.toHaveBeenCalled();
		});

		it('should ignore respectMotionPreference when disabled', () => {
			const { shouldReduceMotion } = require('../../utils/animation.utils');
			shouldReduceMotion.mockReturnValue(true);
			const setup = jest.fn();

			renderHook(() =>
				useAnimationScope(setup, { respectMotionPreference: false }),
			);

			expect(setup).toHaveBeenCalled();
		});

		it('should handle scope revert errors during cleanup', () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
			const { createScope } = require('animejs');

			const mockScope = {
				revert: jest.fn(() => {
					throw new Error('Revert failed');
				}),
			};
			createScope.mockReturnValue(mockScope);

			const setup = jest.fn();

			const { result } = renderHook(() =>
				useAnimationScope(setup, { autoCleanup: false }),
			);

			act(() => {
				result.current.cleanup();
			});

			expect(consoleSpy).toHaveBeenCalledWith(
				'Error cleaning up animation scope:',
				expect.any(Error),
			);

			consoleSpy.mockRestore();
		});

		it('should enable performance monitoring when specified', () => {
			const {
				startAnimationMonitoring,
				stopAnimationMonitoring,
			} = require('../../utils/animation.utils');
			const setup = jest.fn();

			const { result } = renderHook(() =>
				useAnimationScope(setup, {
					autoCleanup: true,
					enablePerformanceMonitoring: true,
				}),
			);

			expect(startAnimationMonitoring).toHaveBeenCalled();

			act(() => {
				result.current.cleanup();
			});

			expect(stopAnimationMonitoring).toHaveBeenCalled();
		});

		it('should handle autoCleanup with revert errors', () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
			const { createScope } = require('animejs');

			const mockScope = {
				revert: jest.fn(() => {
					throw new Error('Cleanup failed');
				}),
			};
			createScope.mockReturnValue(mockScope);

			const setup = jest.fn();

			const { unmount } = renderHook(() =>
				useAnimationScope(setup, { autoCleanup: true }),
			);

			unmount();

			expect(consoleSpy).toHaveBeenCalledWith(
				'Error cleaning up animation scope:',
				expect.any(Error),
			);

			consoleSpy.mockRestore();
		});

		it('should handle setup function with scope parameter', () => {
			const setup = jest.fn(scope => {
				// Use the scope in setup
				if (scope) {
					scope.testMethod?.();
				}
			});

			renderHook(() => useAnimationScope(setup));

			expect(setup).toHaveBeenCalledWith(
				expect.objectContaining({
					revert: expect.any(Function),
				}),
			);
		});

		it('should handle complex configuration object', () => {
			const setup = jest.fn();
			const config = {
				autoCleanup: true,
				enablePerformanceMonitoring: true,
				dependencies: ['test'],
			};

			const { result } = renderHook(() => useAnimationScope(setup, config));

			expect(result.current.scope).toBeDefined();
			expect(setup).toHaveBeenCalled();
		});
	});

	describe('manual cleanup', () => {
		it('should provide manual cleanup function', () => {
			const setup = jest.fn();

			const { result } = renderHook(() =>
				useAnimationScope(setup, { autoCleanup: false }),
			);

			expect(typeof result.current.cleanup).toBe('function');

			act(() => {
				result.current.cleanup();
			});

			const { createScope } = require('animejs');
			const mockScope =
				createScope.mock.results[createScope.mock.results.length - 1]?.value;
			if (mockScope?.revert) {
				expect(mockScope.revert).toHaveBeenCalled();
			}
		});

		it('should handle double cleanup gracefully', () => {
			const setup = jest.fn();

			const { result } = renderHook(() =>
				useAnimationScope(setup, { autoCleanup: false }),
			);

			act(() => {
				result.current.cleanup();
				result.current.cleanup(); // Double cleanup
			});

			// Should not throw errors
			expect(true).toBe(true);
		});

		it('should handle cleanup when scope is null', () => {
			const setup = jest.fn();

			const { result } = renderHook(() =>
				useAnimationScope(setup, { autoCleanup: false }),
			);

			// Manually set scope to null
			act(() => {
				result.current.cleanup();
			});

			// Call cleanup again when scope is already null
			act(() => {
				result.current.cleanup();
			});

			expect(true).toBe(true);
		});
	});

	describe('useAnimationState', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should initialize with default state', () => {
			const { result } = renderHook(() => useAnimationState());

			expect(result.current.isAnimating).toBe(false);
			expect(result.current.progress).toBe(0);
			expect(result.current.performance).toEqual({
				frameRate: 0,
				droppedFrames: 0,
				startTime: 0,
			});
		});

		it('should start animation and update state', () => {
			const { result } = renderHook(() => useAnimationState('test-id', true));

			act(() => {
				(result.current as ExtendedAnimationState).startAnimation();
			});

			expect(result.current.isAnimating).toBe(true);
			expect(result.current.progress).toBe(0);
		});

		it('should stop animation and update state', () => {
			const { result } = renderHook(() => useAnimationState('test-id', true));

			act(() => {
				(result.current as ExtendedAnimationState).startAnimation();
			});

			act(() => {
				(result.current as ExtendedAnimationState).stopAnimation();
			});

			expect(result.current.isAnimating).toBe(false);
			expect(result.current.progress).toBe(1);
		});

		it('should update progress within valid range', () => {
			const { result } = renderHook(() => useAnimationState());

			act(() => {
				(result.current as ExtendedAnimationState).updateProgress(0.5);
			});

			expect(result.current.progress).toBe(0.5);

			// Test clamping to 0-1 range
			act(() => {
				(result.current as ExtendedAnimationState).updateProgress(-0.5);
			});

			expect(result.current.progress).toBe(0);

			act(() => {
				(result.current as ExtendedAnimationState).updateProgress(1.5);
			});

			expect(result.current.progress).toBe(1);
		});

		it('should call animation monitoring functions when enabled', () => {
			const {
				startAnimationMonitoring,
				stopAnimationMonitoring,
			} = require('../../utils/animation.utils');

			const { result } = renderHook(() => useAnimationState('test-id', true));

			act(() => {
				(result.current as ExtendedAnimationState).startAnimation();
			});

			expect(startAnimationMonitoring).toHaveBeenCalledWith('test-id');

			act(() => {
				(result.current as ExtendedAnimationState).stopAnimation();
			});

			expect(stopAnimationMonitoring).toHaveBeenCalledWith('test-id');
		});

		it('should not call monitoring functions when disabled', () => {
			const {
				startAnimationMonitoring,
				stopAnimationMonitoring,
			} = require('../../utils/animation.utils');

			const { result } = renderHook(() => useAnimationState('test-id', false));

			act(() => {
				(result.current as ExtendedAnimationState).startAnimation();
			});

			expect(startAnimationMonitoring).not.toHaveBeenCalled();

			act(() => {
				(result.current as ExtendedAnimationState).stopAnimation();
			});

			expect(stopAnimationMonitoring).not.toHaveBeenCalled();
		});

		it('should not monitor performance when disabled', () => {
			const { result } = renderHook(() => useAnimationState());

			act(() => {
				(result.current as ExtendedAnimationState).startAnimation();
			});

			// Since monitoring is disabled, performance should remain at initial values
			expect(result.current.performance).toEqual({
				frameRate: 0,
				droppedFrames: 0,
				startTime: 0,
			});
		});

		it('should handle animation state without animationId', () => {
			const { result } = renderHook(() => useAnimationState(undefined, true));

			act(() => {
				(result.current as ExtendedAnimationState).startAnimation();
			});

			expect(result.current.isAnimating).toBe(true);

			act(() => {
				(result.current as ExtendedAnimationState).stopAnimation();
			});

			expect(result.current.isAnimating).toBe(false);
		});

		it('should handle performance monitoring updates', () => {
			jest.useFakeTimers();

			// Mock performance.now
			const mockPerformanceNow = jest.spyOn(performance, 'now');
			mockPerformanceNow.mockReturnValue(1000);

			// Mock requestAnimationFrame
			const mockRAF = jest.spyOn(window, 'requestAnimationFrame');
			mockRAF.mockImplementation(callback => {
				setTimeout(callback, 16);
				return 1;
			});

			const { result } = renderHook(() => useAnimationState('test-id', true));

			act(() => {
				(result.current as ExtendedAnimationState).startAnimation();
			});

			// Advance timers to trigger animation frame
			act(() => {
				jest.advanceTimersByTime(20);
			});

			expect(mockRAF).toHaveBeenCalled();

			mockRAF.mockRestore();
			mockPerformanceNow.mockRestore();
			jest.useRealTimers();
		});
	});

	describe('useMultipleAnimationScopes', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should initialize with empty scopes map', () => {
			const { result } = renderHook(() => useMultipleAnimationScopes());

			expect(result.current.scopes.size).toBe(0);
		});

		it('should create a new animation scope', () => {
			const { createScope } = require('animejs');
			const mockScope = { revert: jest.fn() };
			createScope.mockReturnValue(mockScope);

			const { result } = renderHook(() => useMultipleAnimationScopes());
			const setupFn = jest.fn();

			act(() => {
				result.current.createScope('test-scope', setupFn);
			});

			expect(createScope).toHaveBeenCalledWith({ root: document.body });
			expect(setupFn).toHaveBeenCalledWith(mockScope);
			expect(result.current.scopes.get('test-scope')).toBe(mockScope);
		});

		it('should not create scope when motion is reduced', () => {
			const { shouldReduceMotion } = require('../../utils/animation.utils');
			const { createScope } = require('animejs');
			shouldReduceMotion.mockReturnValue(true);

			const { result } = renderHook(() => useMultipleAnimationScopes());
			const setupFn = jest.fn();

			act(() => {
				result.current.createScope('test-scope', setupFn);
			});

			expect(createScope).not.toHaveBeenCalled();
			expect(setupFn).not.toHaveBeenCalled();
			expect(result.current.scopes.size).toBe(0);

			shouldReduceMotion.mockReturnValue(false);
		});

		it('should remove existing scope before creating new one with same ID', () => {
			const { createScope } = require('animejs');
			const oldScope = { revert: jest.fn() };
			const newScope = { revert: jest.fn() };
			createScope.mockReturnValueOnce(oldScope).mockReturnValueOnce(newScope);

			const { result } = renderHook(() => useMultipleAnimationScopes());

			// Create first scope
			act(() => {
				result.current.createScope('test-scope', jest.fn());
			});

			expect(result.current.scopes.get('test-scope')).toBe(oldScope);

			// Create second scope with same ID
			act(() => {
				result.current.createScope('test-scope', jest.fn());
			});

			expect(oldScope.revert).toHaveBeenCalled();
			expect(result.current.scopes.get('test-scope')).toBe(newScope);
		});

		it('should handle setup function errors', () => {
			const { createScope } = require('animejs');
			const mockScope = { revert: jest.fn() };
			createScope.mockReturnValue(mockScope);

			const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

			const { result } = renderHook(() => useMultipleAnimationScopes());
			const setupFn = jest.fn(() => {
				throw new Error('Setup failed');
			});

			act(() => {
				result.current.createScope('test-scope', setupFn);
			});

			expect(consoleSpy).toHaveBeenCalledWith(
				'Error setting up animation scope test-scope:',
				expect.any(Error),
			);
			expect(result.current.scopes.has('test-scope')).toBe(false);

			consoleSpy.mockRestore();
		});

		it('should remove individual scope', () => {
			const { createScope } = require('animejs');
			const mockScope = { revert: jest.fn() };
			createScope.mockReturnValue(mockScope);

			const { result } = renderHook(() => useMultipleAnimationScopes());

			act(() => {
				result.current.createScope('test-scope', jest.fn());
			});

			expect(result.current.scopes.has('test-scope')).toBe(true);

			act(() => {
				result.current.removeScope('test-scope');
			});

			expect(mockScope.revert).toHaveBeenCalled();
			expect(result.current.scopes.has('test-scope')).toBe(false);
		});

		it('should handle errors when removing scope', () => {
			const { createScope } = require('animejs');
			const mockScope = {
				revert: jest.fn(() => {
					throw new Error('Revert failed');
				}),
			};
			createScope.mockReturnValue(mockScope);

			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			const { result } = renderHook(() => useMultipleAnimationScopes());

			act(() => {
				result.current.createScope('test-scope', jest.fn());
			});

			act(() => {
				result.current.removeScope('test-scope');
			});

			expect(consoleSpy).toHaveBeenCalledWith(
				'Error removing scope test-scope:',
				expect.any(Error),
			);
			expect(result.current.scopes.has('test-scope')).toBe(false);

			consoleSpy.mockRestore();
		});

		it('should cleanup all scopes', () => {
			const { createScope } = require('animejs');
			const mockScope1 = { revert: jest.fn() };
			const mockScope2 = { revert: jest.fn() };
			createScope
				.mockReturnValueOnce(mockScope1)
				.mockReturnValueOnce(mockScope2);

			const { result } = renderHook(() => useMultipleAnimationScopes());

			act(() => {
				result.current.createScope('scope1', jest.fn());
				result.current.createScope('scope2', jest.fn());
			});

			expect(result.current.scopes.size).toBe(2);

			act(() => {
				result.current.cleanupAll();
			});

			expect(mockScope1.revert).toHaveBeenCalled();
			expect(mockScope2.revert).toHaveBeenCalled();
			expect(result.current.scopes.size).toBe(0);
		});

		it('should handle cleanup errors during cleanupAll', () => {
			const { createScope } = require('animejs');
			const mockScope = {
				revert: jest.fn(() => {
					throw new Error('Cleanup failed');
				}),
			};
			createScope.mockReturnValue(mockScope);

			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			const { result } = renderHook(() => useMultipleAnimationScopes());

			act(() => {
				result.current.createScope('test-scope', jest.fn());
			});

			act(() => {
				result.current.cleanupAll();
			});

			expect(consoleSpy).toHaveBeenCalledWith(
				'Error cleaning up scope test-scope:',
				expect.any(Error),
			);
			expect(result.current.scopes.size).toBe(0);

			consoleSpy.mockRestore();
		});

		it('should cleanup all scopes on unmount', () => {
			const { createScope } = require('animejs');
			const mockScope = { revert: jest.fn() };
			createScope.mockReturnValue(mockScope);

			const { result, unmount } = renderHook(() =>
				useMultipleAnimationScopes(),
			);

			act(() => {
				result.current.createScope('test-scope', jest.fn());
			});

			expect(result.current.scopes.size).toBe(1);

			unmount();

			expect(mockScope.revert).toHaveBeenCalled();
		});

		it('should handle errors when cleaning up existing scope during creation', () => {
			const { createScope } = require('animejs');
			const oldScope = {
				revert: jest.fn(() => {
					throw new Error('Existing scope cleanup failed');
				}),
			};
			const newScope = { revert: jest.fn() };
			createScope.mockReturnValueOnce(oldScope).mockReturnValueOnce(newScope);

			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			const { result } = renderHook(() => useMultipleAnimationScopes());

			// Create first scope
			act(() => {
				result.current.createScope('test-scope', jest.fn());
			});

			// Create second scope with same ID, should handle cleanup error
			act(() => {
				result.current.createScope('test-scope', jest.fn());
			});

			expect(consoleSpy).toHaveBeenCalledWith(
				'Error cleaning up existing scope test-scope:',
				expect.any(Error),
			);
			expect(result.current.scopes.get('test-scope')).toBe(newScope);

			consoleSpy.mockRestore();
		});

		it('should handle removing non-existent scope gracefully', () => {
			const { result } = renderHook(() => useMultipleAnimationScopes());

			// Try to remove scope that doesn't exist
			act(() => {
				result.current.removeScope('non-existent');
			});

			// Should not throw error
			expect(result.current.scopes.size).toBe(0);
		});
	});
	it('should handle setup function with scope parameter and stop performance monitoring on error', () => {
		const mockScope = { revert: jest.fn() };
		const { createScope } = require('animejs');
		createScope.mockReturnValue(mockScope);

		// Create a setup function that throws an error
		const setupFn = jest.fn(() => {
			throw new Error('Setup failed');
		});

		const { result } = renderHook(() =>
			useAnimationScope(setupFn, {
				enablePerformanceMonitoring: true,
			}),
		);

		// Should handle error gracefully
		expect(result.current.scope).toBe(null);
		expect(setupFn).toHaveBeenCalled();
		expect(mockScope.revert).toHaveBeenCalled();

		// The performance monitoring stop function should be called when error occurs
		// since animationId is set before setup is called
		const { stopAnimationMonitoring } = require('../../utils/animation.utils');
		expect(stopAnimationMonitoring).toHaveBeenCalledTimes(1);
	});
});
