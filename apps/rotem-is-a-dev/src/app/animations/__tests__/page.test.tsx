import { render, screen } from '@testing-library/react';
import React from 'react';
import AnimationsPage from '../page';

interface MockProps {
	children: React.ReactNode;
  className?: string;
	[key: string]: unknown;
}

// Mock the animation components
jest.mock('@lurx-react/vanguardis', () => ({
	FadeIn: ({ children, className, ...props }: MockProps) => {
		const { delay, duration, direction, distance, ...domProps } = props;
		return (
			<div
				data-testid="fade-in"
				className={className}
				style={{ opacity: 0 }}
				{...domProps}
			>
				{children}
			</div>
		);
	},
	SlideIn: ({ children, className, ...props }: MockProps) => {
		const { delay, duration, direction, distance, ...domProps } = props;
		return (
			<div
				data-testid="slide-in"
				className={className}
				style={{ opacity: 0, transform: 'translateX(-20px)' }}
				{...domProps}
			>
				{children}
			</div>
		);
	},
	ScaleIn: ({ children, className, ...props }: MockProps) => {
		const { delay, duration, scale, ...domProps } = props;
		return (
			<div
				data-testid="scale-in"
				className={className}
				style={{ opacity: 0, transform: 'scale(0.8)' }}
				{...domProps}
			>
				{children}
			</div>
		);
	},
	StaggerFadeIn: ({ children, className, ...props }: MockProps) => {
		const { stagger, itemSelector, direction, ...domProps } = props;
		return (
			<div
				data-testid="stagger-fade-in"
				className={className}
				style={{ opacity: 0 }}
				{...domProps}
			>
				{children}
			</div>
		);
	},
}));

// Mock Intersection Observer
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn(),
}));

describe('AnimationsPage', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render the page title', () => {
		render(<AnimationsPage />);

		expect(screen.getByRole('heading', { name: /animation showcase/i })).toBeInTheDocument();
	});

	it('should render the page subtitle', () => {
		render(<AnimationsPage />);

		expect(screen.getByText(/demonstrating various animation patterns/i)).toBeInTheDocument();
	});

	it('should render all main sections', () => {
		render(<AnimationsPage />);

		expect(screen.getByRole('heading', { name: /basic reveal animations/i })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: /direction variations/i })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: /scale animations/i })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: /stagger animations/i })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: /interactive hover effects/i })).toBeInTheDocument();
	});

	it('should render animation examples', () => {
		render(<AnimationsPage />);

		// Check for specific animation demos
		expect(screen.getByText('Fade In')).toBeInTheDocument();
		expect(screen.getByText('Slide In Left')).toBeInTheDocument();
		expect(screen.getByText('Scale In')).toBeInTheDocument();
	});

	it('should render stagger items', () => {
		render(<AnimationsPage />);

		// Check for stagger items (8 items in first stagger)
		expect(screen.getAllByText(/^Item \d+$/)).toHaveLength(8);
	});

	it('should render fast stagger items', () => {
		render(<AnimationsPage />);

		// Check for numbered items (1-12) but handle duplicates
		const firstItem = screen.getByText('1', { selector: '.fastStaggerItem' });
		expect(firstItem).toBeInTheDocument();

		// Just check that all numbers 1-12 exist somewhere
		for (let i = 2; i <= 12; i++) {
			expect(screen.getByText(i.toString(), { selector: '.fastStaggerItem' })).toBeInTheDocument();
		}
	});

	it('should render slow stagger cards', () => {
		render(<AnimationsPage />);

		// Check for slow stagger cards (4 cards)
		expect(screen.getByText('Card 1')).toBeInTheDocument();
		expect(screen.getByText('Card 2')).toBeInTheDocument();
		expect(screen.getByText('Card 3')).toBeInTheDocument();
		expect(screen.getByText('Card 4')).toBeInTheDocument();
	});

	it('should render hover effect cards', () => {
		render(<AnimationsPage />);

		expect(screen.getByText('Glow Effect')).toBeInTheDocument();
		expect(screen.getByText('3D Tilt')).toBeInTheDocument();
		expect(screen.getByText('Scale & Shadow')).toBeInTheDocument();
		expect(screen.getByText('Slide Transform')).toBeInTheDocument();
	});

	it('should render performance features', () => {
		render(<AnimationsPage />);

		expect(screen.getByRole('heading', { name: /performance & accessibility features/i })).toBeInTheDocument();
		expect(screen.getByText(/gpu-accelerated transforms/i)).toBeInTheDocument();
		expect(screen.getByText(/respects prefers-reduced-motion/i)).toBeInTheDocument();
		expect(screen.getByText(/intersection observer/i)).toBeInTheDocument();
	});

	it('should render code examples', () => {
		render(<AnimationsPage />);

		expect(screen.getByRole('heading', { name: /usage examples/i })).toBeInTheDocument();
		expect(screen.getByText('Basic Fade In')).toBeInTheDocument();
		expect(screen.getByText('Slide Animation')).toBeInTheDocument();
		expect(screen.getByText('Stagger Effect')).toBeInTheDocument();
	});

	it('should use various animation components', () => {
		render(<AnimationsPage />);

		// Check that animation components are rendering content
		expect(screen.getByText('Fade In')).toBeInTheDocument();
		expect(screen.getByText('Slide In Left')).toBeInTheDocument();
		expect(screen.getByText('Scale In')).toBeInTheDocument();
		expect(screen.getByText('Slide In Right')).toBeInTheDocument();

		// Check that elements have initial animation styles
		const animationElements = document.querySelectorAll('[style*="opacity: 0"]');
		expect(animationElements.length).toBeGreaterThan(0);
	});

	it('should have proper semantic structure', () => {
		render(<AnimationsPage />);

		// Check for main container
		const mainContent = document.querySelector('[class*="animationsPage"]');
		expect(mainContent).toBeInTheDocument();

		// Check for sections
		const sections = document.querySelectorAll('section');
		expect(sections.length).toBeGreaterThan(0);
	});

	it('should render with proper accessibility attributes', () => {
		render(<AnimationsPage />);

		// Check for headings hierarchy
		const h1 = screen.getByRole('heading', { level: 1 });
		expect(h1).toBeInTheDocument();

		const h2Headings = screen.getAllByRole('heading', { level: 2 });
		expect(h2Headings.length).toBeGreaterThan(0);
	});
});
