import { render, screen } from '@testing-library/react';
import { PacmanRenderer } from '../renderers/pacman-renderer.component';

jest.mock('../rge-pacman-game.module.scss', () => ({
	pacman: 'pacman',
	dirRight: 'dirRight',
	dirDown: 'dirDown',
	dirLeft: 'dirLeft',
	dirUp: 'dirUp',
	dying: 'dying',
}));

describe('PacmanRenderer', () => {
	const defaultProps = {
		position: { x: 3, y: 5 },
		direction: 'LEFT' as const,
		dying: false,
		cellSize: 16,
	};

	it('renders a div with data-testid "pacman"', () => {
		render(<PacmanRenderer {...defaultProps} />);
		expect(screen.getByTestId('pacman')).toBeInTheDocument();
	});

	it('positions the element based on position and cellSize', () => {
		render(<PacmanRenderer {...defaultProps} />);
		const element = screen.getByTestId('pacman');
		expect(element.style.left).toBe('48px');
		expect(element.style.top).toBe('80px');
	});

	it('applies the pacman base class', () => {
		render(<PacmanRenderer {...defaultProps} />);
		const element = screen.getByTestId('pacman');
		expect(element.className).toContain('pacman');
	});

	it('applies dirLeft class when facing LEFT', () => {
		render(<PacmanRenderer {...defaultProps} direction="LEFT" />);
		const element = screen.getByTestId('pacman');
		expect(element.className).toContain('dirLeft');
	});

	it('applies dirRight class when facing RIGHT', () => {
		render(<PacmanRenderer {...defaultProps} direction="RIGHT" />);
		const element = screen.getByTestId('pacman');
		expect(element.className).toContain('dirRight');
	});

	it('applies dirUp class when facing UP', () => {
		render(<PacmanRenderer {...defaultProps} direction="UP" />);
		const element = screen.getByTestId('pacman');
		expect(element.className).toContain('dirUp');
	});

	it('applies dirDown class when facing DOWN', () => {
		render(<PacmanRenderer {...defaultProps} direction="DOWN" />);
		const element = screen.getByTestId('pacman');
		expect(element.className).toContain('dirDown');
	});

	it('calculates position correctly with different cell sizes', () => {
		render(<PacmanRenderer {...defaultProps} position={{ x: 2, y: 4 }} cellSize={24} />);
		const element = screen.getByTestId('pacman');
		expect(element.style.left).toBe('48px');
		expect(element.style.top).toBe('96px');
	});

	it('does not apply dying class when dying is false', () => {
		render(<PacmanRenderer {...defaultProps} dying={false} />);
		const element = screen.getByTestId('pacman');
		expect(element.className).not.toContain('dying');
	});

	it('applies dying class when dying is true', () => {
		render(<PacmanRenderer {...defaultProps} dying={true} />);
		const element = screen.getByTestId('pacman');
		expect(element.className).toContain('dying');
	});
});
