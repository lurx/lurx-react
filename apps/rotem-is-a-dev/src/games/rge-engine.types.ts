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
