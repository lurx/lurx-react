import { render, screen, fireEvent } from '@testing-library/react';
import { GameControls } from '../components/game-controls';

jest.mock('@/app/components/fa-icon', () => ({
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="fa-icon" data-icon={iconName} />
	),
}));

jest.mock('../../rge-snake-game.module.scss', () => ({
	controls: 'controls',
	score: 'score',
	schemeToggle: 'schemeToggle',
}));

jest.mock('../../../components/arrow-key-grid/arrow-key-grid.module.scss', () => ({
	grid: 'grid',
	gridWithBottom: 'gridWithBottom',
	key: 'key',
	button: 'button',
	active: 'active',
	bottomKey: 'bottomKey',
}));

describe('GameControls', () => {
	const defaultProps = {
		score: 5,
		onDirectionPressAction: jest.fn(),
		activeDirection: null as 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null,
		keyScheme: 'arrows' as const,
		isPlaying: false,
		onToggleKeySchemeAction: jest.fn(),
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
		render(<GameControls {...defaultProps} onDirectionPressAction={onDirectionPress} />);
		fireEvent.click(screen.getByTestId('arrow-up'));
		expect(onDirectionPress).toHaveBeenCalledWith('UP');
	});

	it('highlights the active direction button', () => {
		render(<GameControls {...defaultProps} activeDirection="UP" />);
		const upButton = screen.getByTestId('arrow-up');
		expect(upButton.className).toContain('active');
	});

	it('does not highlight inactive direction buttons', () => {
		render(<GameControls {...defaultProps} activeDirection="UP" />);
		const downButton = screen.getByTestId('arrow-down');
		expect(downButton.className).not.toContain('active');
	});

	it('renders arrow icon labels in buttons', () => {
		render(<GameControls {...defaultProps} />);
		expect(screen.getByTestId('arrow-up').querySelector('[data-icon="caret-up"]')).toBeInTheDocument();
		expect(screen.getByTestId('arrow-down').querySelector('[data-icon="caret-down"]')).toBeInTheDocument();
		expect(screen.getByTestId('arrow-left').querySelector('[data-icon="caret-left"]')).toBeInTheDocument();
		expect(screen.getByTestId('arrow-right').querySelector('[data-icon="caret-right"]')).toBeInTheDocument();
	});

	it('has accessible labels on arrow buttons', () => {
		render(<GameControls {...defaultProps} />);
		expect(screen.getByLabelText('up')).toBeInTheDocument();
		expect(screen.getByLabelText('down')).toBeInTheDocument();
		expect(screen.getByLabelText('left')).toBeInTheDocument();
		expect(screen.getByLabelText('right')).toBeInTheDocument();
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
		render(<GameControls {...defaultProps} onToggleKeySchemeAction={onToggleKeyScheme} />);
		fireEvent.click(screen.getByTestId('key-scheme-toggle'));
		expect(onToggleKeyScheme).toHaveBeenCalledTimes(1);
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
