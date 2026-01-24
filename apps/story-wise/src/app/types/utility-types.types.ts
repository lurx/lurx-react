/**
 * Nullable type
 */
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type NullableOptional<T> = Nullable<T> | Optional<T>;

/** Flattens a mapped type in IDE hints. The `& {}` is intentional. */
export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {}; // NOSONAR typescript:S4335 - & {} expands the type in IDEs; do not remove

/**
 * Extract the keys of an object
 */
export type ExtractObjectKeys<O extends object> = keyof O;

/**
 * Extract the values of an object
 */
export type ExtractObjectValues<O extends object> = O[ExtractObjectKeys<O>];
