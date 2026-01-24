/**
 * Nullable type
 */
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type NullableOptional<T> = Nullable<T> | Optional<T>;

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

/**
 * Extract the keys of an object
 */
export type ExtractObjectKeys<O extends object> = keyof O;

/**
 * Extract the values of an object
 */
export type ExtractObjectValues<O extends object> = O[ExtractObjectKeys<O>];
