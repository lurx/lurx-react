import type { ComponentType } from 'react';

export type Game = {
	id: number;
	number: number;
	slug: string;
	description: string;
	preview: ComponentType;
	game: ComponentType;
};
