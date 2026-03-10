import { render, screen } from '@testing-library/react';
import { SnakeRenderer } from '../renderers/snake-renderer.component';

describe('SnakeRenderer', () => {
	it('renders the snake head', () => {
		render(<SnakeRenderer body={[{ x: 5, y: 5 }]} />);
		expect(screen.getByTestId('snake-head')).toBeInTheDocument();
	});

	it('renders snake segments', () => {
		const body = [
			{ x: 5, y: 5 },
			{ x: 5, y: 6 },
			{ x: 5, y: 7 },
		];
		render(<SnakeRenderer body={body} />);
		expect(screen.getByTestId('snake-head')).toBeInTheDocument();
		expect(screen.getAllByTestId('snake-segment')).toHaveLength(2);
	});

	it('positions the head based on cell size', () => {
		render(<SnakeRenderer body={[{ x: 3, y: 4 }]} />);
		const head = screen.getByTestId('snake-head');
		expect(head.style.left).toBe('60px');
		expect(head.style.top).toBe('80px');
	});

	it('applies head styling with larger border radius', () => {
		render(<SnakeRenderer body={[{ x: 0, y: 0 }]} />);
		const head = screen.getByTestId('snake-head');
		expect(head.style.borderRadius).toBe('4px');
	});

	it('applies segment styling with smaller border radius', () => {
		render(
			<SnakeRenderer
				body={[
					{ x: 0, y: 0 },
					{ x: 0, y: 1 },
				]}
			/>
		);
		const segment = screen.getByTestId('snake-segment');
		expect(segment.style.borderRadius).toBe('2px');
	});

	it('applies decreasing opacity to tail segments', () => {
		const body = [
			{ x: 0, y: 0 },
			{ x: 0, y: 1 },
			{ x: 0, y: 2 },
		];
		render(<SnakeRenderer body={body} />);
		const head = screen.getByTestId('snake-head');
		const segments = screen.getAllByTestId('snake-segment');
		const headOpacity = parseFloat(head.style.opacity);
		const lastOpacity = parseFloat(segments[segments.length - 1].style.opacity);
		expect(headOpacity).toBeGreaterThan(lastOpacity);
	});
});
