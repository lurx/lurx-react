import { render, screen } from '@testing-library/react';
import { FoodRenderer } from '../renderers/food-renderer.component';

jest.mock('../rge-snake-game.module.scss', () => ({
	food: 'food',
}));

describe('FoodRenderer', () => {
	it('renders the food element', () => {
		render(<FoodRenderer position={{ x: 3, y: 4 }} />);
		expect(screen.getByTestId('food')).toBeInTheDocument();
	});

	it('positions the food based on cell size', () => {
		render(<FoodRenderer position={{ x: 3, y: 4 }} />);
		const food = screen.getByTestId('food');
		expect(food.style.left).toBe('60px');
		expect(food.style.top).toBe('80px');
	});

	it('renders as a circle', () => {
		render(<FoodRenderer position={{ x: 0, y: 0 }} />);
		const food = screen.getByTestId('food');
		expect(food.style.borderRadius).toBe('50%');
	});

	it('applies the food CSS class', () => {
		render(<FoodRenderer position={{ x: 0, y: 0 }} />);
		const food = screen.getByTestId('food');
		expect(food.className).toContain('food');
	});
});
