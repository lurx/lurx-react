import type { ReactElement } from 'react';

import type { Direction, GamePhase, KeyScheme, Position, SystemArgs } from '../games.types';

export type SnakeGamePhase = GamePhase<'won'>;

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

export type System = (entities: Entities, args: SystemArgs) => Entities;
