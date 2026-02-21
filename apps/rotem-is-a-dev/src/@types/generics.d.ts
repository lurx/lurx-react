type WithDataAttributes<T> = T & {
	[key: `data-${string}`]: unknown;
};
