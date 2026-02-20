import type { ArrowDirection } from '../../snake-game.types';

export const ARROW_DIRECTIONS: ArrowDirection[] = [
	'ArrowUp',
	'ArrowDown',
	'ArrowLeft',
	'ArrowRight',
];

export const KEY_LABELS: Record<ArrowDirection, string> = {
	ArrowUp: 'caret-up',
	ArrowDown: 'caret-down',
	ArrowLeft: 'caret-left',
	ArrowRight: 'caret-right',
};
