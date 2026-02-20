import { render, screen } from '@testing-library/react';
import { ArrowKeys } from '../arrow-keys.component';

jest.mock('../../../hooks/use-snake-game.hook', () => ({
	useSnakeGame: () => ({
		activeKey: null,
		snake: [],
		food: [],
		direction: 'UP',
		gameState: 'idle',
		startGame: jest.fn(),
		resetGame: jest.fn(),
	}),
}));

describe('ArrowKeys', () => {
	it('renders the Up arrow key', () => {
		render(<ArrowKeys />);
		expect(screen.getByLabelText('Up')).toBeInTheDocument();
	});

	it('renders the Down arrow key', () => {
		render(<ArrowKeys />);
		expect(screen.getByLabelText('Down')).toBeInTheDocument();
	});

	it('renders the Left arrow key', () => {
		render(<ArrowKeys />);
		expect(screen.getByLabelText('Left')).toBeInTheDocument();
	});

	it('renders the Right arrow key', () => {
		render(<ArrowKeys />);
		expect(screen.getByLabelText('Right')).toBeInTheDocument();
	});

	it('renders all four arrow keys', () => {
		render(<ArrowKeys />);
		const container = screen.getByLabelText('Arrow key controls');
		expect(container.children).toHaveLength(4);
	});
});
