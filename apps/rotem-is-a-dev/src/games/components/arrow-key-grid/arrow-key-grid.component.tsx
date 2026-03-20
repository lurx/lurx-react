import type { ArrowKeyGridItem, ArrowKeyGridProps } from './arrow-key-grid.types';
import styles from './arrow-key-grid.module.scss';

const renderItem = <T extends string>(
	item: ArrowKeyGridItem<T>,
	isActive: boolean,
	onPressAction?: (value: T) => void,
	extraClassName?: string,
) => {
	const className = [
		styles.key,
		onPressAction ? styles.button : '',
		isActive ? styles.active : '',
		extraClassName ?? '',
	]
		.filter(Boolean)
		.join(' ');

	if (onPressAction) {
		return (
			<button
				key={item.value}
				data-testid={item.testId}
				className={className}
				onClick={() => onPressAction(item.value)}
				type="button"
				aria-label={item.value.toLowerCase().replace('_', ' ')}
			>
				{item.label}
			</button>
		);
	}

	return (
		<div
			key={item.value}
			data-testid={item.testId}
			className={className}
			aria-label={item.value.toLowerCase().replace('_', ' ')}
		>
			{item.label}
		</div>
	);
};

export const ArrowKeyGrid = <T extends string>({
	items,
	activeValue,
	onPressAction,
	bottomAction,
}: ArrowKeyGridProps<T>) => {
	const bottomActionClass = bottomAction ? styles.gridWithBottom : '';
	const gridClassName = [styles.grid, bottomActionClass].filter(Boolean).join(' ');

	return (
		<div className={gridClassName} data-testid="arrow-key-grid">
			{items.map((item) => renderItem(item, item.value === activeValue, onPressAction))}
			{bottomAction && renderItem(bottomAction, bottomAction.value === activeValue, onPressAction, styles.bottomKey)}
		</div>
	);
};
