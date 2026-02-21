'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type {
	Direction,
	GameState,
	Position,
	UseSnakeGameReturn,
} from '../snake-game.types';

export const GRID_COLS = 15;
export const GRID_ROWS = 25;
export const SNAKE_LENGTH = 6;
export const INITIAL_FOOD_COUNT = 10;
const TICK_MS = 200;

const OPPOSITE: Record<Direction, Direction> = {
	UP: 'DOWN',
	DOWN: 'UP',
	LEFT: 'RIGHT',
	RIGHT: 'LEFT',
};

const KEY_TO_DIRECTION: Record<string, Direction> = {
	ArrowUp: 'UP',
	ArrowDown: 'DOWN',
	ArrowLeft: 'LEFT',
	ArrowRight: 'RIGHT',
};

const DIRECTION_DELTA: Record<Direction, Position> = {
	UP: { x: 0, y: -1 },
	DOWN: { x: 0, y: 1 },
	LEFT: { x: -1, y: 0 },
	RIGHT: { x: 1, y: 0 },
};

function buildInitialSnake(): Position[] {
	const centerX = Math.floor(GRID_COLS / 2); // 7
	const centerY = Math.floor(GRID_ROWS / 2); // 12
	// SNAKE_LENGTH segments facing UP: middle segment at (centerX, centerY)
	return Array.from({ length: SNAKE_LENGTH }, (_, index) => ({ x: centerX, y: centerY - Math.floor(SNAKE_LENGTH / 2) + index }));
}

function positionKey(pos: Position): string {
	return `${pos.x},${pos.y}`;
}

function placeFood(snake: Position[], count: number): Position[] {
	const occupied = new Set(snake.map(positionKey));
	const food: Position[] = [];

	while (food.length < count) {
		const candidate: Position = {
			x: Math.floor(Math.random() * GRID_COLS),
			y: Math.floor(Math.random() * GRID_ROWS),
		};
		const key = positionKey(candidate);
		if (!occupied.has(key)) {
			occupied.add(key);
			food.push(candidate);
		}
	}

	return food;
}

export function useSnakeGame(): UseSnakeGameReturn {
	const initialSnake = buildInitialSnake();

	const [snake, setSnake] = useState<Position[]>(initialSnake);
	const [food, setFood] = useState<Position[]>([]);
	const [direction, setDirection] = useState<Direction>('UP');
	const [gameState, setGameState] = useState<GameState>('idle');
	const [activeKey, setActiveKey] = useState<string | null>(null);

	const directionRef = useRef<Direction>('UP');
	const snakeRef = useRef<Position[]>(initialSnake);
	const foodRef = useRef<Position[]>([]);
	const gameStateRef = useRef<GameState>('idle');
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const syncDirection = (dir: Direction) => {
		directionRef.current = dir;
		setDirection(dir);
	};

	const syncFood = (newFood: Position[]) => {
		foodRef.current = newFood;
		setFood(newFood);
	};

	const syncSnake = (newSnake: Position[]) => {
		snakeRef.current = newSnake;
		setSnake(newSnake);
	};

	const stopLoop = useCallback(() => {
		if (intervalRef.current !== null) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	const tick = useCallback(() => {
		const currentSnake = snakeRef.current;
		const currentDirection = directionRef.current;
		const currentFood = foodRef.current;

		const head = currentSnake[0];
		const delta = DIRECTION_DELTA[currentDirection];
		const newHead: Position = { x: head.x + delta.x, y: head.y + delta.y };

		const hitWall =
			newHead.x < 0 ||
			newHead.x >= GRID_COLS ||
			newHead.y < 0 ||
			newHead.y >= GRID_ROWS;

		const hitSelf = currentSnake.some(
			(segment) => segment.x === newHead.x && segment.y === newHead.y,
		);

		if (hitWall || hitSelf) {
			stopLoop();
			setGameState('lost');
			gameStateRef.current = 'lost';
			return;
		}

		const ateFood = currentFood.find(
			(foodItem) => foodItem.x === newHead.x && foodItem.y === newHead.y,
		);

		const newSnake = ateFood
			? [newHead, ...currentSnake]
			: [newHead, ...currentSnake.slice(0, -1)];

		const newFood = ateFood
			? currentFood.filter((foodItem) => !(foodItem.x === newHead.x && foodItem.y === newHead.y))
			: currentFood;

		syncSnake(newSnake);
		syncFood(newFood);

		if (newFood.length === 0) {
			stopLoop();
			setGameState('won');
			gameStateRef.current = 'won';
		}
	}, [stopLoop]);

	const startGame = useCallback(() => {
		const newSnake = buildInitialSnake();
		const newFood = placeFood(newSnake, INITIAL_FOOD_COUNT);

		syncSnake(newSnake);
		syncFood(newFood);
		syncDirection('UP');
		setGameState('playing');
		gameStateRef.current = 'playing';
		setActiveKey(null);

		stopLoop();
		intervalRef.current = setInterval(tick, TICK_MS);
	}, [tick, stopLoop]);

	const resetGame = useCallback(() => {
		stopLoop();
		const newSnake = buildInitialSnake();
		syncSnake(newSnake);
		syncFood([]);
		syncDirection('UP');
		setGameState('idle');
		gameStateRef.current = 'idle';
		setActiveKey(null);
	}, [stopLoop]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const newDirection = KEY_TO_DIRECTION[event.key];
			if (!newDirection) return;

			event.preventDefault();
			setActiveKey(event.key);

			if (gameStateRef.current !== 'playing') return;
			if (newDirection === OPPOSITE[directionRef.current]) return;

			syncDirection(newDirection);
		};

		const handleKeyUp = () => setActiveKey(null);

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			stopLoop();
		};
	}, [stopLoop]);

	return {
		snake,
		food,
		direction,
		gameState,
		activeKey,
		startGame,
		resetGame,
	};
}
