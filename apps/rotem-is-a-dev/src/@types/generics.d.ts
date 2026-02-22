type WithDataAttributes<T> = T & {
	[key: `data-${string}`]: unknown;
};

type Nullable<T> = T | null;

type Optional<T> = T | undefined;

type NullableOptional<T> = T | null | undefined;
