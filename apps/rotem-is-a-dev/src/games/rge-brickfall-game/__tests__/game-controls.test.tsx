import { render, screen, fireEvent } from '@testing-library/react';
import { GameControls } from '../components/game-controls';

jest.mock('../rge-brickfall-game.module.scss', () => ({
	controls: 'controls',
	stats: 'stats',
	score: 'score',
	statLine: 'statLine',
	arrowGrid: 'arrowGrid',
	arrowButton: 'arrowButton',
	arrowButtonActive: 'arrowButtonActive',
	schemeToggle: 'schemeToggle',
}));

const defaultProps = {
	score: 500,
	level: 2,
	linesCleared: 12,
	nextPieceType: 'T' as const,
	activeAction: null,
	keyScheme: 'arrows' as const,
	isPlaying: false,
	onToggleKeyScheme: jest.fn(),
};

describe('GameControls', () => {
	it('renders the controls container', () => {
		render(<GameControls {...defaultProps} />);
		expect(screen.getByTestId('game-controls')).toBeInTheDocument();
	});

	it('displays the score', () => {
		render(<GameControls {...defaultProps} />);
		expect(screen.getByTestId('score')).toHaveTextContent('SCORE: 500');
	});

	it('displays the level', () => {
		render(<GameControls {...defaultProps} />);
		expect(screen.getByTestId('level')).toHaveTextContent('LEVEL: 2');
	});

	it('displays the lines cleared', () => {
		render(<GameControls {...defaultProps} />);
		expect(screen.getByTestId('lines')).toHaveTextContent('LINES: 12');
	});

	it('renders next piece preview', () => {
		render(<GameControls {...defaultProps} />);
		expect(screen.getByTestId('next-piece-preview')).toBeInTheDocument();
	});

	it('renders 5 action buttons', () => {
		render(<GameControls {...defaultProps} />);
		expect(screen.getByTestId('action-rotate')).toBeInTheDocument();
		expect(screen.getByTestId('action-left')).toBeInTheDocument();
		expect(screen.getByTestId('action-right')).toBeInTheDocument();
		expect(screen.getByTestId('action-soft-drop')).toBeInTheDocument();
		expect(screen.getByTestId('action-hard-drop')).toBeInTheDocument();
	});

	it('highlights the active action button', () => {
		render(<GameControls {...defaultProps} activeAction="LEFT" />);
		const leftButton = screen.getByTestId('action-left');
		expect(leftButton.className).toContain('arrowButtonActive');
	});

	it('calls onToggleKeyScheme when toggle is clicked', () => {
		const onToggle = jest.fn();
		render(<GameControls {...defaultProps} onToggleKeyScheme={onToggle} />);
		fireEvent.click(screen.getByTestId('key-scheme-toggle'));
		expect(onToggle).toHaveBeenCalledTimes(1);
	});

	it('shows "use WASD" when scheme is arrows', () => {
		render(<GameControls {...defaultProps} keyScheme="arrows" />);
		expect(screen.getByTestId('key-scheme-toggle')).toHaveTextContent('use WASD');
	});

	it('shows "use arrows" when scheme is wasd', () => {
		render(<GameControls {...defaultProps} keyScheme="wasd" />);
		expect(screen.getByTestId('key-scheme-toggle')).toHaveTextContent('use arrows');
	});

	it('hides the key scheme toggle while playing', () => {
		render(<GameControls {...defaultProps} isPlaying={true} />);
		expect(screen.queryByTestId('key-scheme-toggle')).not.toBeInTheDocument();
	});

	it('shows the key scheme toggle when not playing', () => {
		render(<GameControls {...defaultProps} isPlaying={false} />);
		expect(screen.getByTestId('key-scheme-toggle')).toBeInTheDocument();
	});
});
