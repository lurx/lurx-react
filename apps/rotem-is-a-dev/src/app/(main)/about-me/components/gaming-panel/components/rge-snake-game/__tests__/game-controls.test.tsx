import { render, screen, fireEvent } from '@testing-library/react';
import { GameControls } from '../components/game-controls';

jest.mock('../../rge-snake-game.module.scss', () => ({
	controls: 'controls',
	score: 'score',
	arrowGrid: 'arrowGrid',
	arrowButton: 'arrowButton',
	arrowButtonActive: 'arrowButtonActive',
	schemeToggle: 'schemeToggle',
}));

describe('GameControls', () => {
	const defaultProps = {
		score: 5,
		onDirectionPress: jest.fn(),
		activeDirection: null as 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null,
		keyScheme: 'arrows' as const,
		onToggleKeyScheme: jest.fn(),
	};

	it('renders the score', () => {
		render(<GameControls {...defaultProps} />);
		expect(screen.getByTestId('score')).toHaveTextContent('SCORE: 5');
	});

	it('renders all four arrow buttons', () => {
		render(<GameControls {...defaultProps} />);
		expect(screen.getByTestId('arrow-up')).toBeInTheDocument();
		expect(screen.getByTestId('arrow-down')).toBeInTheDocument();
		expect(screen.getByTestId('arrow-left')).toBeInTheDocument();
		expect(screen.getByTestId('arrow-right')).toBeInTheDocument();
	});

	it('calls onDirectionPress when arrow button is clicked', () => {
		const onDirectionPress = jest.fn();
		render(<GameControls {...defaultProps} onDirectionPress={onDirectionPress} />);
		fireEvent.click(screen.getByTestId('arrow-up'));
		expect(onDirectionPress).toHaveBeenCalledWith('UP');
	});

	it('highlights the active direction button', () => {
		render(<GameControls {...defaultProps} activeDirection="UP" />);
		const upButton = screen.getByTestId('arrow-up');
		expect(upButton.className).toContain('arrowButtonActive');
	});

	it('does not highlight inactive direction buttons', () => {
		render(<GameControls {...defaultProps} activeDirection="UP" />);
		const downButton = screen.getByTestId('arrow-down');
		expect(downButton.className).not.toContain('arrowButtonActive');
	});

	it('renders arrow labels in buttons', () => {
		render(<GameControls {...defaultProps} />);
		expect(screen.getByTestId('arrow-up')).toHaveTextContent('\u25B2');
		expect(screen.getByTestId('arrow-down')).toHaveTextContent('\u25BC');
		expect(screen.getByTestId('arrow-left')).toHaveTextContent('\u25C0');
		expect(screen.getByTestId('arrow-right')).toHaveTextContent('\u25B6');
	});

	it('has accessible labels on arrow buttons', () => {
		render(<GameControls {...defaultProps} />);
		expect(screen.getByLabelText('Move up')).toBeInTheDocument();
		expect(screen.getByLabelText('Move down')).toBeInTheDocument();
		expect(screen.getByLabelText('Move left')).toBeInTheDocument();
		expect(screen.getByLabelText('Move right')).toBeInTheDocument();
	});

	it('renders WASD labels when keyScheme is wasd', () => {
		render(<GameControls {...defaultProps} keyScheme="wasd" />);
		expect(screen.getByTestId('arrow-up')).toHaveTextContent('W');
		expect(screen.getByTestId('arrow-down')).toHaveTextContent('S');
		expect(screen.getByTestId('arrow-left')).toHaveTextContent('A');
		expect(screen.getByTestId('arrow-right')).toHaveTextContent('D');
	});

	it('shows "use WASD" toggle when keyScheme is arrows', () => {
		render(<GameControls {...defaultProps} keyScheme="arrows" />);
		expect(screen.getByTestId('key-scheme-toggle')).toHaveTextContent('use WASD');
	});

	it('shows "use arrows" toggle when keyScheme is wasd', () => {
		render(<GameControls {...defaultProps} keyScheme="wasd" />);
		expect(screen.getByTestId('key-scheme-toggle')).toHaveTextContent('use arrows');
	});

	it('calls onToggleKeyScheme when toggle button is clicked', () => {
		const onToggleKeyScheme = jest.fn();
		render(<GameControls {...defaultProps} onToggleKeyScheme={onToggleKeyScheme} />);
		fireEvent.click(screen.getByTestId('key-scheme-toggle'));
		expect(onToggleKeyScheme).toHaveBeenCalledTimes(1);
	});
});
