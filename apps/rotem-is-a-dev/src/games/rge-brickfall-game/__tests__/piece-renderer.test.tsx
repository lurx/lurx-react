import { render, screen } from '@testing-library/react';
import { PieceRenderer } from '../renderers/piece-renderer.component';

describe('PieceRenderer', () => {
	it('renders 4 cells for a T piece', () => {
		const piece = { type: 'T' as const, position: { x: 3, y: 0 }, rotation: 0 as const };
		render(<PieceRenderer piece={piece} cellSize={20} />);
		const cells = screen.getAllByTestId('active-piece-cell');
		expect(cells).toHaveLength(4);
	});

	it('positions cells correctly', () => {
		const piece = { type: 'O' as const, position: { x: 0, y: 0 }, rotation: 0 as const };
		render(<PieceRenderer piece={piece} cellSize={20} />);
		const cells = screen.getAllByTestId('active-piece-cell');
		expect(cells[0].style.left).toBe('0px');
		expect(cells[0].style.top).toBe('0px');
	});

	it('applies tetromino color', () => {
		const piece = { type: 'T' as const, position: { x: 0, y: 0 }, rotation: 0 as const };
		render(<PieceRenderer piece={piece} cellSize={20} />);
		const cell = screen.getAllByTestId('active-piece-cell')[0];
		expect(cell.style.backgroundColor).toBe('rgb(199, 146, 234)');
	});

	it('renders 4 cells for an I piece', () => {
		const piece = { type: 'I' as const, position: { x: 0, y: 0 }, rotation: 0 as const };
		render(<PieceRenderer piece={piece} cellSize={20} />);
		const cells = screen.getAllByTestId('active-piece-cell');
		expect(cells).toHaveLength(4);
	});
});
