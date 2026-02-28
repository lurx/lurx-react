import { render, screen, fireEvent, act } from '@testing-library/react';
import { DemoCarousel } from '../demo-carousel.component';

const mockScrollPrev = jest.fn();
const mockScrollNext = jest.fn();
const mockScrollTo = jest.fn();
const mockOn = jest.fn();
const mockOff = jest.fn();
const mockSlideNodes = jest.fn(() => [document.createElement('div'), document.createElement('div'), document.createElement('div')]);
const mockSelectedScrollSnap = jest.fn(() => 0);

const mockEmblaApi = {
	scrollPrev: mockScrollPrev,
	scrollNext: mockScrollNext,
	scrollTo: mockScrollTo,
	on: mockOn,
	off: mockOff,
	slideNodes: mockSlideNodes,
	selectedScrollSnap: mockSelectedScrollSnap,
};

const mockEmblaRef = jest.fn();
let mockCurrentEmblaApi: Nullable<typeof mockEmblaApi> = mockEmblaApi;

jest.mock('embla-carousel-react', () => ({
	__esModule: true,
	default: jest.fn(() => [mockEmblaRef, mockCurrentEmblaApi]),
}));

beforeEach(() => {
	jest.clearAllMocks();
	mockCurrentEmblaApi = mockEmblaApi;
	mockSlideNodes.mockReturnValue([
		document.createElement('div'),
		document.createElement('div'),
		document.createElement('div'),
	]);
	mockSelectedScrollSnap.mockReturnValue(0);
});

describe('DemoCarousel', () => {
	it('renders children as slides', () => {
		render(
			<DemoCarousel>
				<div>Slide 1</div>
				<div>Slide 2</div>
				<div>Slide 3</div>
			</DemoCarousel>,
		);
		expect(screen.getByText('Slide 1')).toBeInTheDocument();
		expect(screen.getByText('Slide 2')).toBeInTheDocument();
		expect(screen.getByText('Slide 3')).toBeInTheDocument();
	});

	it('registers the select event listener on mount', () => {
		render(
			<DemoCarousel>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</DemoCarousel>,
		);
		expect(mockOn).toHaveBeenCalledWith('select', expect.any(Function));
	});

	it('shows navigation buttons when there are multiple slides', () => {
		render(
			<DemoCarousel>
				<div>Slide 1</div>
				<div>Slide 2</div>
				<div>Slide 3</div>
			</DemoCarousel>,
		);
		expect(screen.getByLabelText('Previous demo')).toBeInTheDocument();
		expect(screen.getByLabelText('Next demo')).toBeInTheDocument();
	});

	it('disables the previous button at the first slide', () => {
		mockSelectedScrollSnap.mockReturnValue(0);
		render(
			<DemoCarousel>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</DemoCarousel>,
		);
		expect(screen.getByLabelText('Previous demo')).toBeDisabled();
	});

	it('calls scrollPrev when the previous button is clicked and not at the first slide', () => {
		mockSelectedScrollSnap.mockReturnValue(1);
		render(
			<DemoCarousel>
				<div>Slide 1</div>
				<div>Slide 2</div>
				<div>Slide 3</div>
			</DemoCarousel>,
		);
		// Trigger the onSelect callback to update selectedIndex to 1
		const onSelectCallback = mockOn.mock.calls.find(
			(call: [string, () => void]) => call[0] === 'select',
		)?.[1];
		act(() => onSelectCallback?.());

		fireEvent.click(screen.getByLabelText('Previous demo'));
		expect(mockScrollPrev).toHaveBeenCalled();
	});

	it('calls scrollNext when the next button is clicked', () => {
		render(
			<DemoCarousel>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</DemoCarousel>,
		);
		fireEvent.click(screen.getByLabelText('Next demo'));
		expect(mockScrollNext).toHaveBeenCalled();
	});

	it('renders a dot button for each slide', () => {
		render(
			<DemoCarousel>
				<div>Slide 1</div>
				<div>Slide 2</div>
				<div>Slide 3</div>
			</DemoCarousel>,
		);
		const dots = screen.getAllByLabelText(/Go to demo \d+/);
		expect(dots).toHaveLength(3);
	});

	it('calls scrollTo when a dot is clicked', () => {
		render(
			<DemoCarousel>
				<div>Slide 1</div>
				<div>Slide 2</div>
				<div>Slide 3</div>
			</DemoCarousel>,
		);
		fireEvent.click(screen.getByLabelText('Go to demo 2'));
		expect(mockScrollTo).toHaveBeenCalledWith(1);
	});

	it('does not render navigation when there is only one slide', () => {
		mockSlideNodes.mockReturnValue([document.createElement('div')]);
		render(
			<DemoCarousel>
				<div>Only slide</div>
			</DemoCarousel>,
		);
		expect(screen.queryByLabelText('Previous demo')).not.toBeInTheDocument();
		expect(screen.queryByLabelText('Next demo')).not.toBeInTheDocument();
	});

	it('unregisters the select event listener on unmount', () => {
		const { unmount } = render(
			<DemoCarousel>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</DemoCarousel>,
		);
		unmount();
		expect(mockOff).toHaveBeenCalledWith('select', expect.any(Function));
	});

	it('does not crash when emblaApi is null', () => {
		mockCurrentEmblaApi = null;
		render(
			<DemoCarousel>
				<div>Slide 1</div>
			</DemoCarousel>,
		);
		expect(screen.getByText('Slide 1')).toBeInTheDocument();
	});
});
