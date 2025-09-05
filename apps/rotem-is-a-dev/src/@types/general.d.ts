type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type NullableOptional<T> = Nullable<T> | Optional<T>;

type ExtractObjectValues<T> = T[keyof T];
type ExtractObjectKeys<T> = keyof T;
