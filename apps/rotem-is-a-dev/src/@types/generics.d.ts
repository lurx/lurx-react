type WithDataAttributes<T> = T & {
	[key: `data-${string}`]: unknown;
};

type WithAriaAttributes<T> = T & {
  [key: `aria-${string}`]: unknown;
};

type Nullable<T> = T | null;

type Optional<T> = T | undefined;

type NullableOptional<T> = T | null | undefined;

type ExtractObjectValues<T> = T[keyof T];

type ExtractObjectKeys<T> = keyof T;

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
