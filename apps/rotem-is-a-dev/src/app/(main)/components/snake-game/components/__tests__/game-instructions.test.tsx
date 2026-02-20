import { render, screen } from '@testing-library/react';
import { SnakeGameInstructions } from '../game-instructions.component';

describe('SnakeGameInstructions', () => {
	it('renders the keyboard instruction', () => {
		render(<SnakeGameInstructions />);
		expect(screen.getByText('// use keyboard')).toBeInTheDocument();
	});

	it('renders the arrows instruction', () => {
		render(<SnakeGameInstructions />);
		expect(screen.getByText('// arrows to play')).toBeInTheDocument();
	});
});
