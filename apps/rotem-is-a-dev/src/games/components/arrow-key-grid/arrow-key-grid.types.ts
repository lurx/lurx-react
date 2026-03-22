import type { ReactNode } from 'react';

export type ArrowKeyGridItem<T extends string> = {
	value: T;
	label: ReactNode;
	testId?: string;
};

export type ArrowKeyGridProps<T extends string> = {
	items: ArrowKeyGridItem<T>[];
	activeValue: T | null;
	onPressAction?: (value: T) => void;
	onReleaseAction?: (value: T) => void;
	bottomAction?: ArrowKeyGridItem<T>;
};
