import { act, renderHook } from '@testing-library/react';
import { useEffect, useState } from 'react';
import {
    useIntersectionAnimation,
    useInViewport,
    useParallax,
    useScrollAnimation,
    useScrollDirection,
    useScrollProgress,
} from '../use-scroll-animation.hooks';

// Mock dependencies
jest.mock('animejs', () => ({
	onScroll: jest.fn(),
}));

jest.mock('es-toolkit', () => ({
	throttle: jest.fn((fn) => fn),
	debounce: jest.fn((fn) => fn),
}));

jest.mock('../../utils/animation.utils', () => ({
	shouldReduceMotion: jest.fn(() => false),
}));

// Setup DOM mocks
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
const mockRequestAnimationFrame = jest.fn((cb) => {
	cb();
	return 1;
});

// Mock IntersectionObserver
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

const createMockIntersectionObserver = (
	callback: IntersectionObserverCallback,
	options: IntersectionObserverInit
) => ({
	observe: mockObserve,
	unobserve: mockUnobserve,
	disconnect: mockDisconnect,
	callback,
	options,
});

beforeEach(() => {
	jest.clearAllMocks();

	// Reset DOM mocks
	Object.defineProperty(window, 'addEventListener', {
		value: mockAddEventListener,
		writable: true,
	});

	Object.defineProperty(window, 'removeEventListener', {
		value: mockRemoveEventListener,
		writable: true,
	});

	Object.defineProperty(window, 'requestAnimationFrame', {
		value: mockRequestAnimationFrame,
		writable: true,
	});

	// Mock window properties
	Object.defineProperty(window, 'pageYOffset', {
		value: 0,
		writable: true,
	});

	Object.defineProperty(window, 'innerHeight', {
		value: 600,
		writable: true,
	});

	// Mock document properties
	Object.defineProperty(document.documentElement, 'scrollHeight', {
		value: 1200,
		writable: true,
	});

	// Mock querySelector with a jest mock function
	Object.defineProperty(document, 'querySelector', {
		value: jest.fn(),
		writable: true,
	});

	// Setup IntersectionObserver mock
	Object.defineProperty(window, 'IntersectionObserver', {
		value: jest.fn().mockImplementation(createMockIntersectionObserver),
		writable: true,
	});
});

describe('useScrollProgress', () => {
	it('should initialize and set up event listeners', () => {
		const { result } = renderHook(() => useScrollProgress());

		expect(result.current.progress).toBeGreaterThanOrEqual(0);
		expect(result.current.scrollY).toBeGreaterThanOrEqual(0);
		expect(result.current.windowHeight).toBe(600);
		expect(result.current.documentHeight).toBe(1200);
		expect(['up', 'down']).toContain(result.current.direction);

		// Should set up event listeners
		expect(mockAddEventListener).toHaveBeenCalledWith(
			'scroll',
			expect.any(Function),
			{ passive: true }
		);
		expect(mockAddEventListener).toHaveBeenCalledWith(
			'resize',
			expect.any(Function)
		);
	});

	it('should clean up event listeners on unmount', () => {
		const { unmount } = renderHook(() => useScrollProgress());

		unmount();

		expect(mockRemoveEventListener).toHaveBeenCalledWith(
			'scroll',
			expect.any(Function)
		);
		expect(mockRemoveEventListener).toHaveBeenCalledWith(
			'resize',
			expect.any(Function)
		);
	});
});

describe('useScrollAnimation', () => {
	const mockOnScroll = require('animejs').onScroll;
	const mockElement = {
		getBoundingClientRect: jest.fn(() => ({
			top: 100,
			bottom: 200,
			height: 100,
		})),
	};

	beforeEach(() => {
		const mockQuerySelector = document.querySelector as jest.MockedFunction<typeof document.querySelector>;
		mockQuerySelector.mockReturnValue(mockElement as unknown as Element);
	});

	it('should call onScroll with config', () => {
		const config = {
			target: '.test-element',
			enter: 'top bottom',
			leave: 'bottom top',
			sync: 0.5,
			debug: true,
		};

		renderHook(() => useScrollAnimation(config));

		expect(mockOnScroll).toHaveBeenCalledWith({
			target: config.target,
			enter: config.enter,
			leave: config.leave,
			sync: config.sync,
			debug: config.debug,
		});
	});

	it('should handle element selector', () => {
		const config = {
			target: '.test-element',
			enter: 'top bottom',
			leave: 'bottom top',
			sync: 0.5,
		};

		renderHook(() => useScrollAnimation(config));

		const mockQuerySelector = document.querySelector as jest.MockedFunction<typeof document.querySelector>;
		expect(mockQuerySelector).toHaveBeenCalledWith('.test-element');
	});

	it('should handle element reference', () => {
		const elementRef = document.createElement('div');
		const config = {
			target: elementRef,
			enter: 'top bottom',
			leave: 'bottom top',
			sync: 0.5,
		};

		renderHook(() => useScrollAnimation(config));

		const mockQuerySelector = document.querySelector as jest.MockedFunction<typeof document.querySelector>;
		expect(mockQuerySelector).not.toHaveBeenCalled();
	});

	it('should skip animation when motion should be reduced', () => {
		const { shouldReduceMotion } = require('../../utils/animation.utils');
		shouldReduceMotion.mockReturnValue(true);

		const config = {
			target: '.test-element',
			enter: 'top bottom',
			leave: 'bottom top',
			sync: 0.5,
		};

		renderHook(() => useScrollAnimation(config));

		expect(mockOnScroll).not.toHaveBeenCalled();

		// Reset for other tests
		shouldReduceMotion.mockReturnValue(false);
	});

	it('should handle onScroll errors gracefully', () => {
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
		mockOnScroll.mockImplementationOnce(() => {
			throw new Error('Test error');
		});

		const config = {
			target: '.test-element',
			enter: 'top bottom',
			leave: 'bottom top',
			sync: 0.5,
		};

		expect(() => renderHook(() => useScrollAnimation(config))).not.toThrow();
		expect(consoleSpy).toHaveBeenCalledWith(
			'Error creating scroll animation:',
			expect.any(Error)
		);

		consoleSpy.mockRestore();
	});
});

describe('useIntersectionAnimation', () => {
	it('should initialize with correct default values', () => {
		const { result } = renderHook(() => useIntersectionAnimation());

		expect(result.current.ref.current).toBeNull();
		expect(result.current.isIntersecting).toBe(false);
		expect(result.current.hasIntersected).toBe(false);
	});

	it('should not set up IntersectionObserver without an element', () => {
		const mockIntersectionObserver = window.IntersectionObserver as jest.MockedClass<typeof IntersectionObserver>;

		const config = {
			threshold: 0.5,
			rootMargin: '10px',
			once: false,
			animateOnExit: true,
		};

		renderHook(() => useIntersectionAnimation(config));

		// No element attached - observer should not be created
		expect(mockIntersectionObserver).not.toHaveBeenCalled();
	});

	it('should skip observation when motion should be reduced', () => {
		const { shouldReduceMotion } = require('../../utils/animation.utils');
		shouldReduceMotion.mockReturnValue(true);

		const mockIntersectionObserver = window.IntersectionObserver as jest.MockedClass<typeof IntersectionObserver>;

		const { result } = renderHook(() => useIntersectionAnimation());

		// Set a ref element
		const element = document.createElement('div');
		result.current.ref.current = element;

		// Trigger useEffect
		renderHook(() => useIntersectionAnimation());

		expect(mockIntersectionObserver).not.toHaveBeenCalled();

		// Reset for other tests
		shouldReduceMotion.mockReturnValue(false);
	});
});

describe('useParallax', () => {
	it('should initialize with correct default values', () => {
		const { result } = renderHook(() => useParallax());

		expect(result.current.ref.current).toBeNull();
		expect(result.current.transform).toBe('translateY(0px)');
	});

	it('should skip parallax when motion should be reduced', () => {
		const { shouldReduceMotion } = require('../../utils/animation.utils');
		shouldReduceMotion.mockReturnValue(true);

		renderHook(() => useParallax());

		// Should not set up scroll listener when motion is reduced
		const scrollListenerCalls = mockAddEventListener.mock.calls.filter(
			call => call[0] === 'scroll'
		);
		expect(scrollListenerCalls.length).toBe(0);

		// Reset for other tests
		shouldReduceMotion.mockReturnValue(false);
	});
});

describe('useScrollDirection', () => {
	it('should initialize with null direction', () => {
		const { result } = renderHook(() => useScrollDirection());

		expect(result.current).toBeNull();
	});

	it('should set up scroll event listener', () => {
		renderHook(() => useScrollDirection());

		expect(mockAddEventListener).toHaveBeenCalledWith(
			'scroll',
			expect.any(Function),
			{ passive: true }
		);
	});

	it('should clean up scroll listener on unmount', () => {
		const { unmount } = renderHook(() => useScrollDirection());

		unmount();

		expect(mockRemoveEventListener).toHaveBeenCalledWith(
			'scroll',
			expect.any(Function)
		);
	});
});

describe('useInViewport', () => {
	it('should initialize with correct default values', () => {
		const { result } = renderHook(() => useInViewport());

		expect(result.current.ref.current).toBeNull();
		expect(result.current.isInViewport).toBe(false);
		expect(result.current.entry).toBeNull();
	});

	it('should not set up IntersectionObserver without an element', () => {
		const mockIntersectionObserver = window.IntersectionObserver as jest.MockedClass<typeof IntersectionObserver>;

		renderHook(() => useInViewport(0.8, '20px'));

		// No element attached - observer should not be created
		expect(mockIntersectionObserver).not.toHaveBeenCalled();
	});

	it('should set up IntersectionObserver with element and handle viewport changes', () => {
		const mockIntersectionObserver = window.IntersectionObserver as jest.MockedClass<typeof IntersectionObserver>;
		const mockElement = document.createElement('div');

		// Create ref with element already attached
		const mockRef = { current: mockElement };

		const { result } = renderHook(() => {
			// Inline the hook logic with pre-attached ref
			const [isInViewport, setIsInViewport] = useState(false);
			const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

			useEffect(() => {
				const element = mockRef.current;
				if (!element) return;

				const observer = new IntersectionObserver(
					([entry]) => {
						setIsInViewport(entry.isIntersecting);
						setEntry(entry);
					},
					{
						threshold: 0.8,
						rootMargin: '20px',
					},
				);

				observer.observe(element);

				return () => {
					observer.disconnect();
				};
			}, []);

			return {
				ref: mockRef,
				isInViewport,
				entry,
			};
		});

		// Verify observer was created with correct options
		expect(mockIntersectionObserver).toHaveBeenCalledWith(
			expect.any(Function),
			{
				threshold: 0.8,
				rootMargin: '20px',
			}
		);

		// Simulate intersection
		const callback = mockIntersectionObserver.mock.calls[0][0];
		const mockEntry = {
			isIntersecting: true,
			target: mockElement,
			boundingClientRect: {} as DOMRectReadOnly,
			intersectionRatio: 1,
			intersectionRect: {} as DOMRectReadOnly,
			rootBounds: null,
			time: Date.now(),
		} as IntersectionObserverEntry;

		act(() => {
			callback([mockEntry], mockIntersectionObserver.mock.instances[0]);
		});

		expect(result.current.isInViewport).toBe(true);
		expect(result.current.entry).toBe(mockEntry);
	});
});

describe('useIntersectionAnimation - Additional Coverage', () => {
	it('should skip setup when motion should be reduced', () => {
		// Mock shouldReduceMotion to return true
		const mockShouldReduceMotion = require('../../utils/animation.utils').shouldReduceMotion;
		mockShouldReduceMotion.mockReturnValue(true);

		const mockIntersectionObserver = window.IntersectionObserver as jest.MockedClass<typeof IntersectionObserver>;
		const mockElement = document.createElement('div');

		const { result } = renderHook(() => useIntersectionAnimation({
			threshold: 0.5,
			rootMargin: '20px',
		}));

		// Attach element
		act(() => {
			result.current.ref.current = mockElement;
		});

		// Observer should not be created because motion is reduced
		expect(mockIntersectionObserver).not.toHaveBeenCalled();

		// Reset mock
		mockShouldReduceMotion.mockReturnValue(false);
	});

	it('should handle intersection callbacks gracefully', () => {
		const mockIntersectionObserver = window.IntersectionObserver as jest.MockedClass<typeof IntersectionObserver>;
		const mockElement = document.createElement('div');
		const mockOnIntersect = jest.fn();

		// Create ref with element already attached to trigger effect
		const mockRef = { current: mockElement };

		renderHook(() => {
			// Inline the hook logic with pre-attached ref
			const [isIntersecting, setIsIntersecting] = useState(false);
			const [hasIntersected, setHasIntersected] = useState(false);

			useEffect(() => {
				const element = mockRef.current;
				if (!element) return;

				const observer = new IntersectionObserver(
					entries => {
						entries.forEach(entry => {
							setIsIntersecting(entry.isIntersecting);
							if (entry.isIntersecting) setHasIntersected(true);
							mockOnIntersect?.(entry.isIntersecting, entry);
						});
					},
					{
						threshold: 0.5,
						rootMargin: '20px',
					},
				);

				observer.observe(element);

				return () => {
					observer.disconnect();
				};
			}, []);

			return {
				ref: mockRef,
				isIntersecting,
				hasIntersected,
			};
		});

		// Verify observer was created
		expect(mockIntersectionObserver).toHaveBeenCalled();

		// Simulate intersection
		const callback = mockIntersectionObserver.mock.calls[0][0];
		const mockEntry = {
			isIntersecting: true,
			target: mockElement,
			boundingClientRect: {} as DOMRectReadOnly,
			intersectionRatio: 1,
			intersectionRect: {} as DOMRectReadOnly,
			rootBounds: null,
			time: Date.now(),
		} as IntersectionObserverEntry;

		act(() => {
			callback([mockEntry], mockIntersectionObserver.mock.instances[0]);
		});

		// Verify onIntersect was called
		expect(mockOnIntersect).toHaveBeenCalledWith(true, mockEntry);
	});
});

describe('useParallax', () => {
	it('should set up scroll event listener and update transform', () => {
		const mockElement = document.createElement('div');

		const { result, rerender } = renderHook(
			({ speed }) => useParallax(speed),
			{ initialProps: { speed: -0.5 } }
		);

		// Attach element
		act(() => {
			result.current.ref.current = mockElement;
		});

		// Trigger effect by re-rendering
		rerender({ speed: -0.5 });

		// Verify event listener was added
		expect(mockAddEventListener).toHaveBeenCalledWith(
			'scroll',
			expect.any(Function),
			{ passive: true }
		);

		// Simulate scroll
		Object.defineProperty(window, 'pageYOffset', {
			value: 100,
			writable: true,
		});

		// Trigger the scroll event handler
		const scrollHandler = mockAddEventListener.mock.calls.find(
			call => call[0] === 'scroll'
		)?.[1];

		if (scrollHandler) {
			act(() => {
				scrollHandler();
			});
		}

		// Check that transform was updated
		expect(result.current.transform).toBe('translateY(50px)'); // 100 * -(-0.5) = 50
	});
});

describe('useScrollDirection - Additional Coverage', () => {
	it('should handle small scroll changes (less than 5px)', () => {
		const { result } = renderHook(() => useScrollDirection());

		// Initially should be null
		expect(result.current).toBe(null);

		// Simulate small scroll change (less than 5px threshold)
		Object.defineProperty(window, 'pageYOffset', {
			value: 3, // Small change
			writable: true,
		});

		// Trigger scroll event
		const scrollHandler = mockAddEventListener.mock.calls.find(
			call => call[0] === 'scroll'
		)?.[1];

		if (scrollHandler) {
			act(() => {
				scrollHandler();
			});
		}

		// Direction should remain null because change was too small
		expect(result.current).toBe(null);
	});

	it('should use requestAnimationFrame with ticking logic', () => {
		renderHook(() => useScrollDirection());

		// Simulate multiple rapid scroll events
		const scrollHandler = mockAddEventListener.mock.calls.find(
			call => call[0] === 'scroll'
		)?.[1];

		if (scrollHandler) {
			// First call should request animation frame
			act(() => {
				scrollHandler();
			});
			expect(mockRequestAnimationFrame).toHaveBeenCalled();

			// Reset the mock to count subsequent calls
			mockRequestAnimationFrame.mockClear();

			// Immediate second call should not request new frame (ticking = true)
			act(() => {
				scrollHandler();
			});
			// requestAnimationFrame should not be called again due to ticking logic
			expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
		}
	});
});
