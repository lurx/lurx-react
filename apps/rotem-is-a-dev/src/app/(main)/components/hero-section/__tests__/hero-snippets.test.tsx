import { act, fireEvent, render, screen } from '@testing-library/react';

jest.mock('@/lib/shiki', () => ({
	useShikiTokens: ({ code }: { code: string }) =>
		code.split('\n').map((line: string) => ({
			tokens: [{ content: line, color: '#d6deeb' }],
		})),
}));

let mockGameCompleted = true;

let mockOnSelectHandler: Nullable<() => void> = null;
const mockScrollNext = jest.fn();
const mockSelectedScrollSnap = jest.fn(() => 0);
const mockOn = jest.fn((event: string, handler: () => void) => {
	if (event === 'select') mockOnSelectHandler = handler;
});
const mockOff = jest.fn();
const mockEmblaApi = {
	selectedScrollSnap: mockSelectedScrollSnap,
	scrollNext: mockScrollNext,
	on: mockOn,
	off: mockOff,
};

const mockEmblaRef = jest.fn();

let mockCurrentEmblaApi: Nullable<typeof mockEmblaApi> = mockEmblaApi;

jest.mock('embla-carousel-react', () => ({
	__esModule: true,
	default: jest.fn(() => [mockEmblaRef, mockCurrentEmblaApi]),
}));

jest.mock('../hero.context', () => ({
	useHeroContext: () => ({
		gameCompleted: mockGameCompleted,
		handleComplete: jest.fn(),
	}),
}));

import { HeroSnippets } from '../hero-snippets.component';

beforeEach(() => {
	jest.useFakeTimers();
	mockGameCompleted = true;
	mockCurrentEmblaApi = mockEmblaApi;
	mockOnSelectHandler = null;
	mockScrollNext.mockClear();
	mockSelectedScrollSnap.mockClear().mockReturnValue(0);
	mockOn.mockClear();
	mockOff.mockClear();
});

afterEach(() => {
	jest.useRealTimers();
});

describe('HeroSnippets', () => {
	it('renders the carousel when game is completed', () => {
		render(<HeroSnippets />);
		expect(screen.getByTestId('hero-snippets')).toBeInTheDocument();
	});

	it('returns null when game is not completed', () => {
		mockGameCompleted = false;
		const { container } = render(<HeroSnippets />);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders snippet titles', () => {
		render(<HeroSnippets />);
		expect(screen.getByText('debounce')).toBeInTheDocument();
		expect(screen.getByText('throttle')).toBeInTheDocument();
	});

	it('registers a select listener on embla', () => {
		render(<HeroSnippets />);
		expect(mockOn).toHaveBeenCalledWith('select', expect.any(Function));
	});

	it('updates active index when embla fires select', () => {
		render(<HeroSnippets />);
		mockSelectedScrollSnap.mockReturnValue(2);
		act(() => {
			mockOnSelectHandler?.();
		});
		const slides = screen.getAllByText(/debounce|throttle|deep-clone|flatten|group-by|memoize|chunk/);
		expect(slides.length).toBeGreaterThan(0);
	});

	it('auto-scrolls every 2 seconds', () => {
		render(<HeroSnippets />);
		act(() => {
			jest.advanceTimersByTime(2000);
		});
		expect(mockScrollNext).toHaveBeenCalledTimes(1);

		act(() => {
			jest.advanceTimersByTime(2000);
		});
		expect(mockScrollNext).toHaveBeenCalledTimes(2);
	});

	it('pauses auto-scroll on mouse enter', () => {
		render(<HeroSnippets />);
		const viewport = screen.getByTestId('hero-snippets');

		fireEvent.mouseEnter(viewport);
		act(() => {
			jest.advanceTimersByTime(4000);
		});
		expect(mockScrollNext).not.toHaveBeenCalled();
	});

	it('resumes auto-scroll on mouse leave', () => {
		render(<HeroSnippets />);
		const viewport = screen.getByTestId('hero-snippets');

		fireEvent.mouseEnter(viewport);
		fireEvent.mouseLeave(viewport);
		act(() => {
			jest.advanceTimersByTime(2000);
		});
		expect(mockScrollNext).toHaveBeenCalledTimes(1);
	});

	it('cleans up embla listener on unmount', () => {
		const { unmount } = render(<HeroSnippets />);
		unmount();
		expect(mockOff).toHaveBeenCalledWith('select', expect.any(Function));
	});

	it('handles null embla API gracefully', () => {
		mockCurrentEmblaApi = null;
		render(<HeroSnippets />);
		expect(screen.getByTestId('hero-snippets')).toBeInTheDocument();
		// Should not register any event listener
		expect(mockOn).not.toHaveBeenCalled();
		// Auto-scroll should not fire
		act(() => {
			jest.advanceTimersByTime(4000);
		});
		expect(mockScrollNext).not.toHaveBeenCalled();
	});
});
