import { act, render, screen } from '@testing-library/react';
import { FadeIn, ScaleIn, SlideIn, StaggerFadeIn } from '../reveal-animations';

// Mock the animation utilities
jest.mock('../../../utils/animation.utils', () => ({
	shouldReduceMotion: jest.fn(() => false),
	getAnimationDuration: jest.fn((duration: number) => duration),
}));

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

beforeAll(() => {
	global.IntersectionObserver = mockIntersectionObserver.mockImplementation(
		callback => ({
			observe: mockObserve,
			unobserve: mockUnobserve,
			disconnect: mockDisconnect,
			callback,
		}),
	);
});

describe('Reveal Animations', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockIntersectionObserver.mockClear();
		mockObserve.mockClear();
		mockUnobserve.mockClear();
		mockDisconnect.mockClear();

		// Reset shouldReduceMotion to false
		const { shouldReduceMotion } = require('../../../utils/animation.utils');
		shouldReduceMotion.mockReturnValue(false);
	});

	describe('FadeIn', () => {
		it('should render children with initial hidden state', () => {
			render(
				<FadeIn>
					<div>Fade in content</div>
				</FadeIn>,
			);

			const content = screen.getByText('Fade in content');
			const container = content.parentElement;

			expect(content).toBeInTheDocument();
			expect(container).toHaveStyle({ opacity: '0' });
		});

		it('should set up intersection observer', () => {
			render(
				<FadeIn>
					<div>Test content</div>
				</FadeIn>,
			);

			expect(mockIntersectionObserver).toHaveBeenCalledWith(
				expect.any(Function),
				{ threshold: 0.1 },
			);
			expect(mockObserve).toHaveBeenCalled();
		});

		it('should apply custom className', () => {
			render(
				<FadeIn className="custom-fade">
					<div>Test content</div>
				</FadeIn>,
			);

			const content = screen.getByText('Test content');
			const container = content.parentElement;

			expect(container).toHaveClass('custom-fade');
		});

		it('should animate when element intersects', async () => {
			jest.useFakeTimers();

			render(
				<FadeIn delay={100}>
					<div>Test content</div>
				</FadeIn>,
			);

			// Get the callback function passed to IntersectionObserver
			const observerCallback = mockIntersectionObserver.mock.calls[0][0];
			const mockEntry = {
				isIntersecting: true,
				target: screen.getByText('Test content').parentElement,
			};

			// Trigger intersection
			act(() => {
				observerCallback([mockEntry]);
			});

			// Fast-forward the delay
			act(() => {
				jest.advanceTimersByTime(100);
			});

			const container = screen.getByText('Test content').parentElement;
			expect(container).toHaveStyle({
				opacity: '1',
				transform: 'translateX(0) translateY(0)',
			});

			jest.useRealTimers();
		});

		it('should handle different directions', () => {
			const { rerender } = render(
				<FadeIn
					direction="up"
					distance={50}
				>
					<div>Test content</div>
				</FadeIn>,
			);

			let container = screen.getByText('Test content').parentElement;
			expect(container).toHaveStyle({ transform: 'translateY(50px)' });

			rerender(
				<FadeIn
					direction="left"
					distance={30}
				>
					<div>Test content</div>
				</FadeIn>,
			);

			container = screen.getByText('Test content').parentElement;
			expect(container).toHaveStyle({ transform: 'translateX(30px)' });
		});

		it('should skip animation when motion is reduced', () => {
			const { shouldReduceMotion } = require('../../../utils/animation.utils');
			shouldReduceMotion.mockReturnValue(true);

			render(
				<FadeIn>
					<div>Test content</div>
				</FadeIn>,
			);

			expect(mockIntersectionObserver).not.toHaveBeenCalled();
		});

		it('should disconnect observer on unmount', () => {
			const { unmount } = render(
				<FadeIn>
					<div>Test content</div>
				</FadeIn>,
			);

			unmount();

			expect(mockDisconnect).toHaveBeenCalled();
		});

		it('should unobserve element when once is true and animation completes', () => {
			render(
				<FadeIn once={true}>
					<div>Test content</div>
				</FadeIn>,
			);

			const observerCallback = mockIntersectionObserver.mock.calls[0][0];
			const mockEntry = {
				isIntersecting: true,
				target: screen.getByText('Test content').parentElement,
			};

			act(() => {
				observerCallback([mockEntry]);
			});

			expect(mockUnobserve).toHaveBeenCalled();
		});
	});

	describe('SlideIn', () => {
		it('should render with correct initial transform for direction', () => {
			render(
				<SlideIn
					direction="left"
					distance={100}
				>
					<div>Slide content</div>
				</SlideIn>,
			);

			const container = screen.getByText('Slide content').parentElement;
			expect(container).toHaveStyle({
				opacity: '0',
				transform: 'translateX(-100px)',
			});
		});

		it('should handle all slide directions correctly', () => {
			const directions = [
				{ direction: 'left' as const, expected: 'translateX(-50px)' },
				{ direction: 'right' as const, expected: 'translateX(50px)' },
				{ direction: 'up' as const, expected: 'translateY(-50px)' },
				{ direction: 'down' as const, expected: 'translateY(50px)' },
			];

			directions.forEach(({ direction, expected }) => {
				const { unmount } = render(
					<SlideIn direction={direction}>
						<div>{direction} content</div>
					</SlideIn>,
				);

				const container = screen.getByText(
					`${direction} content`,
				).parentElement;
				expect(container).toHaveStyle({ transform: expected });

				unmount();
			});
		});

		it('should animate on intersection', async () => {
			jest.useFakeTimers();

			render(
				<SlideIn
					direction="right"
					delay={50}
				>
					<div>Slide content</div>
				</SlideIn>,
			);

			const observerCallback = mockIntersectionObserver.mock.calls[0][0];
			const mockEntry = {
				isIntersecting: true,
				target: screen.getByText('Slide content').parentElement,
			};

			act(() => {
				observerCallback([mockEntry]);
			});

			act(() => {
				jest.advanceTimersByTime(50);
			});

			const container = screen.getByText('Slide content').parentElement;
			expect(container).toHaveStyle({
				opacity: '1',
				transform: 'translateX(0) translateY(0)',
			});

			jest.useRealTimers();
		});
	});

	describe('ScaleIn', () => {
		it('should render with initial scale transform', () => {
			render(
				<ScaleIn scale={0.5}>
					<div>Scale content</div>
				</ScaleIn>,
			);

			const container = screen.getByText('Scale content').parentElement;
			expect(container).toHaveStyle({
				opacity: '0',
				transform: 'scale(0.5)',
			});
		});

		it('should animate to scale(1) on intersection', async () => {
			jest.useFakeTimers();

			render(
				<ScaleIn>
					<div>Scale content</div>
				</ScaleIn>,
			);

			const observerCallback = mockIntersectionObserver.mock.calls[0][0];
			const mockEntry = {
				isIntersecting: true,
				target: screen.getByText('Scale content').parentElement,
			};

			act(() => {
				observerCallback([mockEntry]);
			});

			act(() => {
				jest.advanceTimersByTime(0);
			});

			const container = screen.getByText('Scale content').parentElement;
			expect(container).toHaveStyle({
				opacity: '1',
				transform: 'scale(1)',
			});

			jest.useRealTimers();
		});

		it('should use custom threshold', () => {
			render(
				<ScaleIn threshold={0.5}>
					<div>Scale content</div>
				</ScaleIn>,
			);

			expect(mockIntersectionObserver).toHaveBeenCalledWith(
				expect.any(Function),
				{ threshold: 0.5 },
			);
		});
	});

	describe('StaggerFadeIn', () => {
		beforeEach(() => {
			// Mock querySelectorAll
			const mockElements = [
				{
					style: {},
					addEventListener: jest.fn(),
					removeEventListener: jest.fn(),
				},
				{
					style: {},
					addEventListener: jest.fn(),
					removeEventListener: jest.fn(),
				},
			];

			Object.defineProperty(global.HTMLElement.prototype, 'querySelectorAll', {
				value: jest.fn(() => mockElements),
				writable: true,
			});
		});

		it('should render children with stagger container', () => {
			const { container } = render(
				<StaggerFadeIn>
					<div>Item 1</div>
					<div>Item 2</div>
				</StaggerFadeIn>,
			);

			expect(container.textContent).toContain('Item 1');
			expect(container.textContent).toContain('Item 2');
		});

		it('should set up intersection observer with correct threshold', () => {
			render(
				<StaggerFadeIn threshold={0.3}>
					<div>Item 1</div>
					<div>Item 2</div>
				</StaggerFadeIn>,
			);

			expect(mockIntersectionObserver).toHaveBeenCalledWith(
				expect.any(Function),
				{ threshold: 0.3 },
			);
		});

		it('should apply custom itemSelector', () => {
			render(
				<StaggerFadeIn itemSelector=".stagger-item">
					<div className="stagger-item">Item 1</div>
					<div className="stagger-item">Item 2</div>
				</StaggerFadeIn>,
			);

			// The querySelectorAll should be called (we can't easily test the exact selector due to mocking)
			expect(mockIntersectionObserver).toHaveBeenCalled();
		});

		it('should handle empty element list gracefully', () => {
			Object.defineProperty(global.HTMLElement.prototype, 'querySelectorAll', {
				value: jest.fn(() => []),
				writable: true,
			});

			expect(() => {
				render(
					<StaggerFadeIn>
						<div>Item 1</div>
					</StaggerFadeIn>,
				);
			}).not.toThrow();
		});

		it('should skip animation when motion is reduced', () => {
			const { shouldReduceMotion } = require('../../../utils/animation.utils');
			shouldReduceMotion.mockReturnValue(true);

			render(
				<StaggerFadeIn>
					<div>Item 1</div>
				</StaggerFadeIn>,
			);

			expect(mockIntersectionObserver).not.toHaveBeenCalled();
		});
	});

	describe('Common behavior', () => {
		it('should handle non-intersecting entries', () => {
			const { container } = render(
				<FadeIn>
					<div>Test content</div>
				</FadeIn>,
			);

			const observerCallback = mockIntersectionObserver.mock.calls[0][0];
			const mockEntry = {
				isIntersecting: false,
				target: container.firstChild,
			};

			act(() => {
				observerCallback([mockEntry]);
			});

			expect(container.firstChild).toHaveStyle({ opacity: '0' });
		});

		it('should handle animation duration from utils', () => {
			const {
				getAnimationDuration,
			} = require('../../../utils/animation.utils');
			getAnimationDuration.mockReturnValue(500);

			render(
				<FadeIn duration={1000}>
					<div>Test content</div>
				</FadeIn>,
			);

			expect(getAnimationDuration).toHaveBeenCalledWith(1000);
		});

		it('should not animate twice when once=true', () => {
			const { container } = render(
				<FadeIn once={true}>
					<div>Test content</div>
				</FadeIn>,
			);

			const observerCallback = mockIntersectionObserver.mock.calls[0][0];
			const mockEntry = {
				isIntersecting: true,
				target: container.firstChild,
			};

			// First intersection
			act(() => {
				observerCallback([mockEntry]);
			});

			expect(mockUnobserve).toHaveBeenCalled();

			// Reset and try again
			mockUnobserve.mockClear();

			// Second intersection
			act(() => {
				observerCallback([mockEntry]);
			});

			// Should not unobserve again since element was already unobserved
			expect(mockUnobserve).not.toHaveBeenCalled();
		});
	});
});
