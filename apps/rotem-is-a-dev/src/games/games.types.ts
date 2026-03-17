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

export type Position = {
	x: number;
	y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type KeyScheme = 'arrows' | 'wasd';

export type GamePhase<T extends string = never> = 'idle' | 'playing' | 'lost' | T;

export type SystemArgs = {
	input: InputEvent[];
	events: GameEvent[];
	dispatch: (event: GameEvent) => void;
	time: GameTime;
};
