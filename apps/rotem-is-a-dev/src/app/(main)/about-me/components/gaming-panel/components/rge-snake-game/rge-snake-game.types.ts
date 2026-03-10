import type { ReactElement } from 'react';

export type Position = {
	x: number;
	y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GamePhase = 'idle' | 'playing' | 'won' | 'lost';

export type SnakeGameConfig = {
	gridCols?: number;
	gridRows?: number;
	cellSize?: number;
	tickMs?: number;
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
};

export type Entities = {
	snake: SnakeEntity;
	food: FoodEntity;
	board: BoardEntity;
};

export type GameTime = {
	current: number;
	previous: number | null;
	delta: number;
	previousDelta: number | null;
};

export type InputEvent = {
	name: string;
	payload: { key?: string };
};

export type GameEvent = {
	type: string;
};

export type SystemArgs = {
	input: InputEvent[];
	events: GameEvent[];
	dispatch: (event: GameEvent) => void;
	time: GameTime;
};

export type System = (entities: Entities, args: SystemArgs) => Entities;
