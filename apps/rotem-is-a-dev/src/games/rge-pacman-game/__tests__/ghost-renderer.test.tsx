import { render, screen } from '@testing-library/react';
import { GhostRenderer } from '../renderers/ghost-renderer.component';

jest.mock('../rge-pacman-game.module.scss', () => ({
	ghost: 'ghost',
	blinky: 'blinky',
	pinky: 'pinky',
	inky: 'inky',
	clyde: 'clyde',
	frightened: 'frightened',
	eaten: 'eaten',
	frightenedFlash: 'frightenedFlash',
	pupilUp: 'pupilUp',
	pupilDown: 'pupilDown',
	pupilLeft: 'pupilLeft',
	pupilRight: 'pupilRight',
}));

describe('GhostRenderer', () => {
	const defaultProps = {
		name: 'blinky' as const,
		position: { x: 5, y: 5 },
		direction: 'LEFT' as const,
		mode: 'chase' as const,
		frightenedTimer: 0,
		cellSize: 16,
	};

	describe('chase and scatter modes', () => {
		it('applies the ghost base class and ghost name class for blinky', () => {
			render(<GhostRenderer {...defaultProps} />);
			const ghost = screen.getByTestId('ghost-blinky');
			expect(ghost.className).toContain('ghost');
			expect(ghost.className).toContain('blinky');
		});

		it('applies the pinky class in scatter mode', () => {
			render(<GhostRenderer {...defaultProps} name="pinky" mode="scatter" />);
			const ghost = screen.getByTestId('ghost-pinky');
			expect(ghost.className).toContain('pinky');
		});

		it('applies the inky class', () => {
			render(<GhostRenderer {...defaultProps} name="inky" />);
			const ghost = screen.getByTestId('ghost-inky');
			expect(ghost.className).toContain('inky');
		});

		it('applies the clyde class', () => {
			render(<GhostRenderer {...defaultProps} name="clyde" />);
			const ghost = screen.getByTestId('ghost-clyde');
			expect(ghost.className).toContain('clyde');
		});

		it('positions the ghost based on position and cellSize', () => {
			render(<GhostRenderer {...defaultProps} />);
			const ghost = screen.getByTestId('ghost-blinky');
			expect(ghost.style.left).toBe('80px');
			expect(ghost.style.top).toBe('80px');
		});
	});

	describe('direction-based pupils', () => {
		it('applies pupilLeft class when direction is LEFT', () => {
			render(<GhostRenderer {...defaultProps} direction="LEFT" />);
			const ghost = screen.getByTestId('ghost-blinky');
			expect(ghost.className).toContain('pupilLeft');
		});

		it('applies pupilRight class when direction is RIGHT', () => {
			render(<GhostRenderer {...defaultProps} direction="RIGHT" />);
			const ghost = screen.getByTestId('ghost-blinky');
			expect(ghost.className).toContain('pupilRight');
		});

		it('applies pupilUp class when direction is UP', () => {
			render(<GhostRenderer {...defaultProps} direction="UP" />);
			const ghost = screen.getByTestId('ghost-blinky');
			expect(ghost.className).toContain('pupilUp');
		});

		it('applies pupilDown class when direction is DOWN', () => {
			render(<GhostRenderer {...defaultProps} direction="DOWN" />);
			const ghost = screen.getByTestId('ghost-blinky');
			expect(ghost.className).toContain('pupilDown');
		});
	});

	describe('frightened mode', () => {
		it('applies the frightened class when frightened', () => {
			render(
				<GhostRenderer {...defaultProps} mode="frightened" frightenedTimer={5000} />,
			);
			const ghost = screen.getByTestId('ghost-blinky');
			expect(ghost.className).toContain('frightened');
			expect(ghost.className).not.toContain('blinky');
		});

		it('applies frightenedFlash class when timer is below threshold', () => {
			render(
				<GhostRenderer {...defaultProps} mode="frightened" frightenedTimer={1500} />,
			);
			const ghost = screen.getByTestId('ghost-blinky');
			expect(ghost.className).toContain('frightenedFlash');
		});

		it('does not apply frightenedFlash class when timer is above threshold', () => {
			render(
				<GhostRenderer {...defaultProps} mode="frightened" frightenedTimer={5000} />,
			);
			const ghost = screen.getByTestId('ghost-blinky');
			expect(ghost.className).not.toContain('frightenedFlash');
		});
	});

	describe('eaten mode', () => {
		it('applies the eaten class', () => {
			render(<GhostRenderer {...defaultProps} mode="eaten" />);
			const ghost = screen.getByTestId('ghost-blinky');
			expect(ghost.className).toContain('eaten');
		});

		it('still applies direction class when eaten', () => {
			render(<GhostRenderer {...defaultProps} mode="eaten" direction="RIGHT" />);
			const ghost = screen.getByTestId('ghost-blinky');
			expect(ghost.className).toContain('pupilRight');
		});
	});

	describe('house mode', () => {
		it('returns null when in house mode', () => {
			const { container } = render(<GhostRenderer {...defaultProps} mode="house" />);
			expect(container.innerHTML).toBe('');
		});

		it('does not render a ghost element when in house mode', () => {
			render(<GhostRenderer {...defaultProps} mode="house" />);
			expect(screen.queryByTestId('ghost-blinky')).not.toBeInTheDocument();
		});
	});

	it('renders no text content', () => {
		render(<GhostRenderer {...defaultProps} />);
		const ghost = screen.getByTestId('ghost-blinky');
		expect(ghost.textContent).toBe('');
	});
});
