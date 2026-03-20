import { render, screen, fireEvent } from '@testing-library/react';
import { GameControls } from '../components/game-controls';

jest.mock('../../components/arrow-key-grid', () => ({
	ArrowKeyGrid: () => <div data-testid="arrow-key-grid" />,
}));

jest.mock('@/app/components/fa-icon', () => ({
	FaIcon: () => <span data-testid="fa-icon" />,
}));

jest.mock('../rge-pacman-game.module.scss', () => ({
	controls: 'controls',
	stats: 'stats',
	score: 'score',
	statLine: 'statLine',
	schemeToggle: 'schemeToggle',
}));

describe('GameControls', () => {
	const defaultProps = {
		score: 100,
		lives: 3,
		activeAction: null as 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null,
		keyScheme: 'arrows' as const,
		isPlaying: false,
		onToggleKeySchemeAction: jest.fn(),
	};

	it('renders the game-controls container', () => {
		render(<GameControls {...defaultProps} />);
		expect(screen.getByTestId('game-controls')).toBeInTheDocument();
	});

	it('renders the score', () => {
		render(<GameControls {...defaultProps} score={250} />);
		expect(screen.getByTestId('score')).toHaveTextContent('SCORE: 250');
	});

	it('renders the lives with emoji circles', () => {
		render(<GameControls {...defaultProps} lives={3} />);
		const livesElement = screen.getByTestId('lives');
		expect(livesElement).toHaveTextContent('LIVES:');
		expect(livesElement.textContent).toContain('\u{1F7E1}\u{1F7E1}\u{1F7E1}');
	});

	it('renders the ArrowKeyGrid component', () => {
		render(<GameControls {...defaultProps} />);
		expect(screen.getByTestId('arrow-key-grid')).toBeInTheDocument();
	});

	describe('key scheme toggle', () => {
		it('shows "use WASD" toggle when keyScheme is arrows and not playing', () => {
			render(
				<GameControls
					{...defaultProps}
					keyScheme="arrows"
					isPlaying={false}
				/>
			);
			expect(screen.getByTestId('key-scheme-toggle')).toHaveTextContent(
				'use WASD'
			);
		});

		it('shows "use arrows" toggle when keyScheme is wasd and not playing', () => {
			render(
				<GameControls
					{...defaultProps}
					keyScheme="wasd"
					isPlaying={false}
				/>
			);
			expect(screen.getByTestId('key-scheme-toggle')).toHaveTextContent(
				'use arrows'
			);
		});

		it('calls onToggleKeyScheme when toggle button is clicked', () => {
			const onToggleKeyScheme = jest.fn();
			render(
				<GameControls
					{...defaultProps}
					onToggleKeySchemeAction={onToggleKeyScheme}
				/>
			);
			fireEvent.click(screen.getByTestId('key-scheme-toggle'));
			expect(onToggleKeyScheme).toHaveBeenCalledTimes(1);
		});

		it('hides the key scheme toggle while playing', () => {
			render(<GameControls {...defaultProps} isPlaying={true} />);
			expect(
				screen.queryByTestId('key-scheme-toggle')
			).not.toBeInTheDocument();
		});

		it('shows the key scheme toggle when not playing', () => {
			render(<GameControls {...defaultProps} isPlaying={false} />);
			expect(
				screen.getByTestId('key-scheme-toggle')
			).toBeInTheDocument();
		});
	});

	it('renders zero lives as empty string', () => {
		render(<GameControls {...defaultProps} lives={0} />);
		const livesElement = screen.getByTestId('lives');
		expect(livesElement).toHaveTextContent('LIVES:');
	});

	it('renders score of 0', () => {
		render(<GameControls {...defaultProps} score={0} />);
		expect(screen.getByTestId('score')).toHaveTextContent('SCORE: 0');
	});
});
