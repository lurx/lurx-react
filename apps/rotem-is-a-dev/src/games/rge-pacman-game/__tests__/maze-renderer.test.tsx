import { render, screen } from '@testing-library/react';
import { MazeRenderer } from '../renderers/maze-renderer.component';
import type { CellType } from '../rge-pacman-game.types';

jest.mock('../rge-pacman-game.module.scss', () => ({
	mazeCell: 'mazeCell',
	wall: 'wall',
	dot: 'dot',
	power: 'power',
	powerPellet: 'powerPellet',
}));

describe('MazeRenderer', () => {
	const CELL_SIZE = 16;

	it('renders wall cells with data-testid "maze-wall"', () => {
		const grid: CellType[][] = [['wall', 'empty', 'empty']];
		render(<MazeRenderer grid={grid} cellSize={CELL_SIZE} />);
		expect(screen.getByTestId('maze-wall')).toBeInTheDocument();
	});

	it('renders dot cells with data-testid "maze-dot"', () => {
		const grid: CellType[][] = [['empty', 'dot', 'empty']];
		render(<MazeRenderer grid={grid} cellSize={CELL_SIZE} />);
		expect(screen.getByTestId('maze-dot')).toBeInTheDocument();
	});

	it('renders power cells with data-testid "maze-power"', () => {
		const grid: CellType[][] = [['empty', 'empty', 'power']];
		render(<MazeRenderer grid={grid} cellSize={CELL_SIZE} />);
		expect(screen.getByTestId('maze-power')).toBeInTheDocument();
	});

	it('does not render elements for empty cells', () => {
		const grid: CellType[][] = [['empty']];
		const { container } = render(
			<MazeRenderer grid={grid} cellSize={CELL_SIZE} />
		);
		expect(container.childElementCount).toBe(0);
	});

	it('does not render elements for tunnel cells', () => {
		const grid: CellType[][] = [['tunnel']];
		const { container } = render(
			<MazeRenderer grid={grid} cellSize={CELL_SIZE} />
		);
		expect(container.childElementCount).toBe(0);
	});

	it('does not render elements for ghost-house cells', () => {
		const grid: CellType[][] = [['ghost-house']];
		const { container } = render(
			<MazeRenderer grid={grid} cellSize={CELL_SIZE} />
		);
		expect(container.childElementCount).toBe(0);
	});

	it('does not render elements for ghost-door cells', () => {
		const grid: CellType[][] = [['ghost-door']];
		const { container } = render(
			<MazeRenderer grid={grid} cellSize={CELL_SIZE} />
		);
		expect(container.childElementCount).toBe(0);
	});

	it('renders correct number of walls in a 3x3 grid', () => {
		const grid: CellType[][] = [
			['wall', 'wall', 'wall'],
			['wall', 'dot', 'wall'],
			['wall', 'wall', 'wall'],
		];
		render(<MazeRenderer grid={grid} cellSize={CELL_SIZE} />);
		expect(screen.getAllByTestId('maze-wall')).toHaveLength(8);
		expect(screen.getAllByTestId('maze-dot')).toHaveLength(1);
	});

	it('positions cells correctly based on row and column indices', () => {
		const grid: CellType[][] = [
			['empty', 'empty'],
			['empty', 'wall'],
		];
		render(<MazeRenderer grid={grid} cellSize={CELL_SIZE} />);
		const wall = screen.getByTestId('maze-wall');
		expect(wall.style.left).toBe('16px');
		expect(wall.style.top).toBe('16px');
	});

	it('applies mazeCell base class to all rendered cells', () => {
		const grid: CellType[][] = [['wall', 'dot', 'power']];
		render(<MazeRenderer grid={grid} cellSize={CELL_SIZE} />);
		expect(screen.getByTestId('maze-wall').className).toContain('mazeCell');
		expect(screen.getByTestId('maze-dot').className).toContain('mazeCell');
		expect(screen.getByTestId('maze-power').className).toContain('mazeCell');
	});

	it('applies wall class to wall cells', () => {
		const grid: CellType[][] = [['wall']];
		render(<MazeRenderer grid={grid} cellSize={CELL_SIZE} />);
		expect(screen.getByTestId('maze-wall').className).toContain('wall');
	});

	it('applies dot class to dot cells', () => {
		const grid: CellType[][] = [['dot']];
		render(<MazeRenderer grid={grid} cellSize={CELL_SIZE} />);
		expect(screen.getByTestId('maze-dot').className).toContain('dot');
	});

	it('applies power class to power cells', () => {
		const grid: CellType[][] = [['power']];
		render(<MazeRenderer grid={grid} cellSize={CELL_SIZE} />);
		expect(screen.getByTestId('maze-power').className).toContain('power');
	});

	it('applies powerPellet class to power pellet cells', () => {
		const grid: CellType[][] = [['power']];
		render(<MazeRenderer grid={grid} cellSize={CELL_SIZE} />);
		expect(screen.getByTestId('maze-power').className).toContain('powerPellet');
	});

	it('does not apply powerPellet class to non-power cells', () => {
		const grid: CellType[][] = [['wall', 'dot']];
		render(<MazeRenderer grid={grid} cellSize={CELL_SIZE} />);
		expect(screen.getByTestId('maze-wall').className).not.toContain('powerPellet');
		expect(screen.getByTestId('maze-dot').className).not.toContain('powerPellet');
	});

	it('renders a mixed grid with all cell types correctly', () => {
		const grid: CellType[][] = [
			['wall', 'dot', 'power'],
			['empty', 'ghost-house', 'tunnel'],
			['ghost-door', 'dot', 'wall'],
		];
		render(<MazeRenderer grid={grid} cellSize={CELL_SIZE} />);
		expect(screen.getAllByTestId('maze-wall')).toHaveLength(2);
		expect(screen.getAllByTestId('maze-dot')).toHaveLength(2);
		expect(screen.getAllByTestId('maze-power')).toHaveLength(1);
	});
});
