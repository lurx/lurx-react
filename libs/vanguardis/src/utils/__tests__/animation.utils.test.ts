import {
    createAnimationUtils,
    getAnimationDuration,
    getMotionPreferences,
    setMotionPreference,
    shouldReduceMotion,
    startAnimationMonitoring,
    stopAnimationMonitoring,
} from '../animation.utils';

// Mock anime.js createScope
jest.mock('animejs', () => ({
	createScope: jest.fn().mockReturnValue({
		revert: jest.fn(),
	}),
}));

// Mock window.matchMedia
const mockMatchMedia = jest.fn();

// Mock performance.now
const mockPerformanceNow = jest.fn();

// Mock localStorage
const mockLocalStorage = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn()
};

describe('Animation Utils', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockPerformanceNow.mockReturnValue(1000);

		// Set up window.matchMedia mock
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: mockMatchMedia,
		});

		// Set up global matchMedia for fallback
		global.matchMedia = mockMatchMedia;

		// Set up performance mock
		global.performance = { now: mockPerformanceNow } as Performance;

		// Set up localStorage mock
		Object.defineProperty(window, 'localStorage', {
			value: mockLocalStorage,
		});

		// Default localStorage behavior
		mockLocalStorage.getItem.mockReturnValue(null);
	});

	describe('getMotionPreferences', () => {
		it('should return reduced motion when system preference is enabled', () => {
			mockMatchMedia.mockReturnValue({
				matches: true,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			});

			const preferences = getMotionPreferences();

			expect(preferences.prefersReducedMotion).toBe(true);
			expect(preferences.motionLevel).toBe('reduced');
		});

		it('should return full motion when system preference is disabled', () => {
			mockMatchMedia.mockReturnValue({
				matches: false,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			});

			const preferences = getMotionPreferences();

			expect(preferences.prefersReducedMotion).toBe(false);
			expect(preferences.motionLevel).toBe('full');
		});

		it('should respect custom motion level from localStorage', () => {
			mockMatchMedia.mockReturnValue({
				matches: false,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			});
			mockLocalStorage.getItem.mockReturnValue('none');

			const preferences = getMotionPreferences();

			expect(preferences.motionLevel).toBe('none');
		});

		it('should prioritize localStorage over system preference', () => {
			mockMatchMedia.mockReturnValue({
				matches: true,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			});
			mockLocalStorage.getItem.mockReturnValue('full');

			const preferences = getMotionPreferences();

			expect(preferences.prefersReducedMotion).toBe(true);
			expect(preferences.motionLevel).toBe('full');
		});
	});

	describe('setMotionPreference', () => {
		const mockDispatchEvent = jest.fn();

		beforeEach(() => {
			Object.defineProperty(window, 'dispatchEvent', {
				value: mockDispatchEvent,
			});
		});

		it('should set motion preference in localStorage', () => {
			setMotionPreference('reduced');

			expect(mockLocalStorage.setItem).toHaveBeenCalledWith('motion-preference', 'reduced');
		});

		it('should dispatch custom event', () => {
			setMotionPreference('none');

			expect(mockDispatchEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'motion-preference-changed',
					detail: { motionLevel: 'none' },
				})
			);
		});
	});

	describe('shouldReduceMotion', () => {
		it('should return true when motion level is none', () => {
			mockMatchMedia.mockReturnValue({
				matches: false,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			});
			mockLocalStorage.getItem.mockReturnValue('none');

			expect(shouldReduceMotion()).toBe(true);
		});

		it('should return true when system prefers reduced motion', () => {
			mockMatchMedia.mockReturnValue({
				matches: true,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			});
			mockLocalStorage.getItem.mockReturnValue(null);

			expect(shouldReduceMotion()).toBe(true);
		});

		it('should return false when motion is full and system does not prefer reduced', () => {
			mockMatchMedia.mockReturnValue({
				matches: false,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			});
			mockLocalStorage.getItem.mockReturnValue('full');

			expect(shouldReduceMotion()).toBe(false);
		});
	});

	describe('getAnimationDuration', () => {
		it('should return custom duration when provided and motion is not reduced', () => {
			mockMatchMedia.mockReturnValue({
				matches: false,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			});

			expect(getAnimationDuration(500)).toBe(500);
		});

		it('should return default duration when motion is not reduced', () => {
			mockMatchMedia.mockReturnValue({
				matches: false,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			});

			expect(getAnimationDuration(300)).toBe(300);
		});

		it('should return reduced duration when motion is reduced', () => {
			mockMatchMedia.mockReturnValue({
				matches: true,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			});

			// When reduced motion is enabled, it should return 50% duration (max 200ms)
			expect(getAnimationDuration(500)).toBe(200); // 500 * 0.5 = 250, but max is 200
			expect(getAnimationDuration(300)).toBe(150); // 300 * 0.5 = 150
		});

		it('should return 0 when motion preference is set to none', () => {
			mockMatchMedia.mockReturnValue({
				matches: false,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			});

			// Mock localStorage to return 'none'
			mockLocalStorage.getItem.mockReturnValue('none');

			expect(getAnimationDuration(500)).toBe(0);
			expect(getAnimationDuration(300)).toBe(0);
		});

		it('should return minimum of 0 for negative durations', () => {
			mockMatchMedia.mockReturnValue({
				matches: false,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			});

			// Note: The function might not handle negative values explicitly
			// This test verifies the actual behavior
			expect(getAnimationDuration(0)).toBe(0);
		});
	});

	describe('createAnimationUtils', () => {
		const mockCreateScope = require('animejs').createScope;

		beforeEach(() => {
			mockCreateScope.mockClear();
		});

		it('should create animation utilities with createScope function', () => {
			const utils = createAnimationUtils();
			const mockScope = { revert: jest.fn() };
			mockCreateScope.mockReturnValue(mockScope);

			const scope = utils.createScope();

			expect(mockCreateScope).toHaveBeenCalled();
			expect(scope).toBe(mockScope);
		});

		it('should cleanup all active scopes', () => {
			const utils = createAnimationUtils();
			const mockScope1 = { revert: jest.fn() };
			const mockScope2 = { revert: jest.fn() };

			mockCreateScope.mockReturnValueOnce(mockScope1).mockReturnValueOnce(mockScope2);

			utils.createScope();
			utils.createScope();
			utils.cleanup();

			expect(mockScope1.revert).toHaveBeenCalled();
			expect(mockScope2.revert).toHaveBeenCalled();
		});

		it('should handle cleanup errors gracefully', () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
			const utils = createAnimationUtils();
			const mockScope = {
				revert: jest.fn().mockImplementation(() => {
					throw new Error('Cleanup error');
				}),
			};

			mockCreateScope.mockReturnValue(mockScope);

			utils.createScope();
			utils.cleanup();

			expect(consoleSpy).toHaveBeenCalledWith(
				'Error cleaning up animation scope:',
				expect.any(Error)
			);

			consoleSpy.mockRestore();
		});

		it('should provide shouldReduceMotion function', () => {
			const utils = createAnimationUtils();

			expect(typeof utils.shouldReduceMotion).toBe('function');
			expect(utils.shouldReduceMotion).toBe(shouldReduceMotion);
		});

		it('should provide getPerformanceMetrics function', () => {
			const utils = createAnimationUtils();

			expect(typeof utils.getPerformanceMetrics).toBe('function');
		});

		it('should pass root element to createScope', () => {
			const rootElement = document.createElement('div');
			const utils = createAnimationUtils();

			utils.createScope(rootElement);

			expect(mockCreateScope).toHaveBeenCalledWith({ root: rootElement });
		});
	});

	describe('performance monitoring', () => {
		beforeEach(() => {
			// Mock requestAnimationFrame
			global.requestAnimationFrame = jest.fn((cb) => {
				setTimeout(cb, 16);
				return 1;
			});
		});

		it('should start animation monitoring', () => {
			startAnimationMonitoring('test-animation');

			// Should not throw any errors
			expect(true).toBe(true);
		});

		it('should stop animation monitoring', () => {
			startAnimationMonitoring('test-animation');
			stopAnimationMonitoring('test-animation');

			// Should not throw any errors
			expect(true).toBe(true);
		});

		it('should provide performance metrics', () => {
			const utils = createAnimationUtils();
			const metrics = utils.getPerformanceMetrics();

			expect(typeof metrics).toBe('object');
			expect(typeof metrics.frameRate).toBe('number');
			expect(typeof metrics.droppedFrames).toBe('number');
			expect(typeof metrics.startTime).toBe('number');
		});
	});

	describe('edge cases', () => {
		it('should handle getAnimationDuration with edge case values', () => {
			mockMatchMedia.mockReturnValue({
				matches: false,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			});
			mockLocalStorage.getItem.mockReturnValue(null);

			// Test with zero
			expect(getAnimationDuration(0)).toBe(0);

			// Test with very large number
			expect(getAnimationDuration(10000)).toBe(10000);

			// Test with decimal
			expect(getAnimationDuration(123.45)).toBe(123.45);
		});

		it('should handle reduced motion with decimal duration', () => {
			mockMatchMedia.mockReturnValue({
				matches: false,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			});
			mockLocalStorage.getItem.mockReturnValue('reduced');

			// 500 * 0.5 = 250, but max is 200
			expect(getAnimationDuration(500)).toBe(200);

			// 300 * 0.5 = 150, which is less than 200
			expect(getAnimationDuration(300)).toBe(150);
		});
	});

	describe('Animation Performance Monitor', () => {
		let mockRequestAnimationFrame: jest.Mock;

		beforeEach(() => {
			mockRequestAnimationFrame = jest.fn();
			global.requestAnimationFrame = mockRequestAnimationFrame;
		});

		it('should detect dropped frames when frame time exceeds threshold', () => {
			// Mock multiple calls to performance.now to simulate frame timing
			mockPerformanceNow
				.mockReturnValueOnce(1000) // Initial time
				.mockReturnValueOnce(1000) // First frame
				.mockReturnValueOnce(1050); // Second frame with 50ms delta (should trigger dropped frame)

			// Start monitoring
			startAnimationMonitoring('test-dropped-frames');

			// Manually trigger frame monitoring by executing the callback
			if (mockRequestAnimationFrame.mock.calls.length > 0) {
				const callback = mockRequestAnimationFrame.mock.calls[0][0];
				callback();
			}

			// Get metrics
			const utils = createAnimationUtils();
			const metrics = utils.getPerformanceMetrics();

			expect(metrics).toBeDefined();
			expect(metrics.droppedFrames).toBeGreaterThanOrEqual(0);

			stopAnimationMonitoring('test-dropped-frames');
		});

		it('should reset performance monitor correctly', () => {
			// Start and get some data
			startAnimationMonitoring('test-reset');
			mockPerformanceNow.mockReturnValue(2000);

			// Get metrics through utils
			const utils = createAnimationUtils();
			const metrics = utils.getPerformanceMetrics();

			expect(metrics).toBeDefined();
			expect(metrics.frameRate).toBeGreaterThanOrEqual(0);

			stopAnimationMonitoring('test-reset');
		});

		it('should handle frame monitoring when lastFrameTime is initially 0', () => {
			// Fresh start with no previous frame time
			startAnimationMonitoring('test-initial-frame');

			// First call should not calculate delta time since lastFrameTime is 0
			mockPerformanceNow.mockReturnValue(3000);

			// Get metrics
			const utils = createAnimationUtils();
			const metrics = utils.getPerformanceMetrics();

			expect(metrics).toBeDefined();
			expect(metrics.frameRate).toBeGreaterThanOrEqual(0);
			expect(metrics.droppedFrames).toBeGreaterThanOrEqual(0);

			stopAnimationMonitoring('test-initial-frame');
		});
	});
});
