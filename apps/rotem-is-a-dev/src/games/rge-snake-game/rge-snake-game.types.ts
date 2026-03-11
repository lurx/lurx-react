import type { ReactElement } from 'react';
import type { GameEvent, GameTime, InputEvent } from '../rge-engine.types';

export type { GameEvent, GameTime, InputEvent };

export type Position = {
	x: number;
	y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GamePhase = 'idle' | 'playing' | 'won' | 'lost';

export type KeyScheme = 'arrows' | 'wasd';

export type SnakeGameConfig = {
	gridCols?: number;
	gridRows?: number;
	cellSize?: number;
	tickMs?: number;
	winLength?: number;
};

export type SnakeEntity = {
	body: Position[];
	direction: Direction;
	growing: boolean;
	cellSize: number;
	renderer: ReactElement;
};

export type FoodEntity = {
	position: Position;
	cellSize: number;
	renderer: ReactElement;
};

export type BoardEntity = {
	width: number;
	height: number;
	cellSize: number;
	tickMs: number;
	lastTickTime: number;
	keyScheme: KeyScheme;
	winLength: number;
};

export type Entities = {
	snake: SnakeEntity;
	food: FoodEntity;
	board: BoardEntity;
};

export type SystemArgs = {
	input: InputEvent[];
	events: GameEvent[];
	dispatch: (event: GameEvent) => void;
	time: GameTime;
};

export type System = (entities: Entities, args: SystemArgs) => Entities;
