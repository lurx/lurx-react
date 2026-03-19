import type { ArrowKeyGridItem, ArrowKeyGridProps } from './arrow-key-grid.types';
import styles from './arrow-key-grid.module.scss';

const renderItem = <T extends string>(
	item: ArrowKeyGridItem<T>,
	isActive: boolean,
	onPress?: (value: T) => void,
	extraClassName?: string,
) => {
	const className = [
		styles.key,
		onPress ? styles.button : '',
		isActive ? styles.active : '',
		extraClassName ?? '',
	]
		.filter(Boolean)
		.join(' ');

	if (onPress) {
		return (
			<button
				key={item.value}
				data-testid={item.testId}
				className={className}
				onClick={() => onPress(item.value)}
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
	onPress,
	bottomAction,
}: ArrowKeyGridProps<T>) => {
	const bottomActionClass = bottomAction ? styles.gridWithBottom : '';
	const gridClassName = [styles.grid, bottomActionClass].filter(Boolean).join(' ');

	return (
		<div className={gridClassName} data-testid="arrow-key-grid">
			{items.map((item) => renderItem(item, item.value === activeValue, onPress))}
			{bottomAction && renderItem(bottomAction, bottomAction.value === activeValue, onPress, styles.bottomKey)}
		</div>
	);
};
