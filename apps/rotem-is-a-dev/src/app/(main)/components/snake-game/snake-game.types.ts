export type Position = {
	x: number;
	y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type ArrowDirection =
	| 'ArrowUp'
	| 'ArrowDown'
	| 'ArrowLeft'
	| 'ArrowRight';

export type GameState = 'idle' | 'playing' | 'won' | 'lost';

export type SnakeGameState = {
	snake: Position[];
	food: Position[];
	direction: Direction;
	gameState: GameState;
	activeKey: Nullable<string>;
}

export type UseSnakeGameReturn = SnakeGameState & {
	startGame: () => void;
	resetGame: () => void;
}

export type SnakeGameProps = {
	onWin: () => void;
	onSkip: () => void;
}
