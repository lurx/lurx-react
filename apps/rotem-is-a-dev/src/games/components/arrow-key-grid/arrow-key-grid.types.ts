import type { ReactNode } from 'react';

export type ArrowKeyGridItem<T extends string> = {
	value: T;
	label: ReactNode;
	testId?: string;
};

export type ArrowKeyGridProps<T extends string> = {
	items: ArrowKeyGridItem<T>[];
	activeValue: T | null;
	onPress?: (value: T) => void;
	bottomAction?: ArrowKeyGridItem<T>;
};
