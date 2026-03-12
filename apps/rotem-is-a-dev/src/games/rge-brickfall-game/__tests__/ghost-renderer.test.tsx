import { render, screen } from '@testing-library/react';
import { GhostRenderer } from '../renderers/ghost-renderer.component';

describe('GhostRenderer', () => {
	it('renders 4 ghost cells for a T piece', () => {
		render(
			<GhostRenderer
				position={{ x: 3, y: 18 }}
				type="T"
				rotation={0}
				cellSize={20}
			/>,
		);
		const cells = screen.getAllByTestId('ghost-cell');
		expect(cells).toHaveLength(4);
	});

	it('positions ghost cells correctly', () => {
		render(
			<GhostRenderer
				position={{ x: 0, y: 0 }}
				type="O"
				rotation={0}
				cellSize={20}
			/>,
		);
		const cells = screen.getAllByTestId('ghost-cell');
		expect(cells[0].style.left).toBe('0px');
		expect(cells[0].style.top).toBe('0px');
	});

	it('uses transparent background with colored border', () => {
		render(
			<GhostRenderer
				position={{ x: 0, y: 0 }}
				type="T"
				rotation={0}
				cellSize={20}
			/>,
		);
		const cell = screen.getAllByTestId('ghost-cell')[0];
		expect(cell.style.backgroundColor).toBe('transparent');
		expect(cell.style.border).toContain('rgb(199, 146, 234)');
	});

	it('applies ghost opacity', () => {
		render(
			<GhostRenderer
				position={{ x: 0, y: 0 }}
				type="T"
				rotation={0}
				cellSize={20}
			/>,
		);
		const cell = screen.getAllByTestId('ghost-cell')[0];
		expect(cell.style.opacity).toBe('0.2');
	});
});
