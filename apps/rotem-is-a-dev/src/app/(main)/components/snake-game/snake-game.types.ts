export interface Position {
	x: number;
	y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameState = 'idle' | 'playing' | 'won' | 'lost';

export interface SnakeGameState {
	snake: Position[];
	food: Position[];
	direction: Direction;
	gameState: GameState;
	activeKey: string | null;
}

export interface UseSnakeGameReturn extends SnakeGameState {
	startGame: () => void;
	resetGame: () => void;
}
