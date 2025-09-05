import {
  easingFunctions,
  getAnimationDuration,
  getMotionPreferences,
  setMotionPreference,
  shouldReduceMotion,
} from '../animation.utils';
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
		matches: query.includes('reduce'),
		media: query,
		onchange: null,
		addListener: jest.fn(), // deprecated
		removeListener: jest.fn(), // deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

describe('Animation Utils', () => {
	beforeEach(() => {
		localStorageMock.clear();
		jest.clearAllMocks();
	});

	describe('getMotionPreferences', () => {
		it('should return default motion preferences', () => {
			const preferences = getMotionPreferences();
			expect(preferences).toEqual({
				prefersReducedMotion: true, // based on our mock
				motionLevel: 'reduced',
			});
		});

		it('should respect custom motion level from localStorage', () => {
			localStorageMock.setItem('motion-preference', 'full');
			const preferences = getMotionPreferences();
			expect(preferences.motionLevel).toBe('full');
		});
	});

	describe('setMotionPreference', () => {
		it('should set motion preference in localStorage', () => {
			setMotionPreference('none');
			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				'motion-preference',
				'none',
			);
		});

		it('should dispatch custom event', () => {
			const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
			setMotionPreference('full');

			expect(dispatchEventSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'motion-preference-changed',
					detail: { motionLevel: 'full' },
				}),
			);
		});
	});

	describe('shouldReduceMotion', () => {
		it('should return true when motion should be reduced', () => {
			localStorageMock.setItem('motion-preference', 'none');
			expect(shouldReduceMotion()).toBe(true);
		});

		it('should return false when motion is allowed', () => {
			// Mock matchMedia to return false for reduced motion
			(window.matchMedia as jest.Mock).mockImplementation(() => ({
				matches: false,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			}));

			localStorageMock.setItem('motion-preference', 'full');
			expect(shouldReduceMotion()).toBe(false);
		});
	});

	describe('getAnimationDuration', () => {
		it('should return 0 for no motion', () => {
			localStorageMock.setItem('motion-preference', 'none');
			expect(getAnimationDuration(1000)).toBe(0);
		});

		it('should return reduced duration for reduced motion', () => {
			localStorageMock.setItem('motion-preference', 'reduced');
			expect(getAnimationDuration(1000)).toBe(200); // max 200ms
		});

		it('should return full duration for full motion', () => {
			(window.matchMedia as jest.Mock).mockImplementation(() => ({
				matches: false,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			}));

			localStorageMock.setItem('motion-preference', 'full');
			expect(getAnimationDuration(1000)).toBe(1000);
		});
	});

	describe('easingFunctions', () => {
		it('should contain all easing function definitions', () => {
			expect(easingFunctions.ease).toBeDefined();
			expect(easingFunctions.easeIn).toBeDefined();
			expect(easingFunctions.easeOut).toBeDefined();
			expect(easingFunctions.easeInOut).toBeDefined();
			expect(easingFunctions.spring).toBeDefined();
			expect(easingFunctions.bounce).toBeDefined();
			expect(easingFunctions.elastic).toBeDefined();
			expect(easingFunctions.linear).toBeDefined();
			expect(easingFunctions.smooth).toBeDefined();
		});

		it('should have valid cubic-bezier values', () => {
			expect(easingFunctions.ease).toMatch(/cubic-bezier/);
			expect(easingFunctions.spring).toMatch(/cubic-bezier/);
		});
	});
});
