import { render, screen } from '@testing-library/react';
import { PlayfieldRenderer } from '../renderers/playfield-renderer.component';
import { createEmptyGrid } from '../rge-brickfall-game.helpers';

describe('PlayfieldRenderer', () => {
	it('renders nothing for an empty grid', () => {
		const grid = createEmptyGrid(20, 10);
		const { container } = render(<PlayfieldRenderer grid={grid} cellSize={20} />);
		expect(container.innerHTML).toBe('');
	});

	it('renders a cell for each occupied grid position', () => {
		const grid = createEmptyGrid(20, 10);
		grid[19][0] = '#ff0000';
		grid[19][1] = '#00ff00';
		render(<PlayfieldRenderer grid={grid} cellSize={20} />);
		const cells = screen.getAllByTestId('playfield-cell');
		expect(cells).toHaveLength(2);
	});

	it('positions cells correctly using inline styles', () => {
		const grid = createEmptyGrid(20, 10);
		grid[5][3] = '#ff0000';
		render(<PlayfieldRenderer grid={grid} cellSize={20} />);
		const cell = screen.getByTestId('playfield-cell');
		expect(cell.style.left).toBe('60px');
		expect(cell.style.top).toBe('100px');
	});

	it('applies the correct background color', () => {
		const grid = createEmptyGrid(20, 10);
		grid[0][0] = '#c792ea';
		render(<PlayfieldRenderer grid={grid} cellSize={20} />);
		const cell = screen.getByTestId('playfield-cell');
		expect(cell.style.backgroundColor).toBe('rgb(199, 146, 234)');
	});

	it('applies clearingCell class to cells in clearing rows', () => {
		const grid = createEmptyGrid(20, 10);
		grid[19][0] = '#ff0000';
		grid[18][0] = '#00ff00';
		render(<PlayfieldRenderer grid={grid} cellSize={20} clearingRows={[19]} />);
		const cells = screen.getAllByTestId('playfield-cell');
		const clearingCell = cells.find((cell) => cell.style.top === '380px');
		const normalCell = cells.find((cell) => cell.style.top === '360px');
		expect(clearingCell?.className).toContain('clearingCell');
		expect(normalCell?.className).toBeFalsy();
	});

	it('does not apply clearingCell class when clearingRows is empty', () => {
		const grid = createEmptyGrid(20, 10);
		grid[19][0] = '#ff0000';
		render(<PlayfieldRenderer grid={grid} cellSize={20} clearingRows={[]} />);
		const cell = screen.getByTestId('playfield-cell');
		expect(cell.className).toBeFalsy();
	});
});
