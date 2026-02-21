export function deepClone<T>(value: T): T {
	if (value === null || typeof value !== 'object') return value;
	if (Array.isArray(value)) return value.map(deepClone) as T;
	return Object.fromEntries(
		Object.entries(value as Record<string, unknown>).map(([key, val]) => [
			key,
			deepClone(val),
		]),
	) as T;
}

