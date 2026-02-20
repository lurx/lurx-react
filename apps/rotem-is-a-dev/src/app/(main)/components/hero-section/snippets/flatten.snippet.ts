export function flatten<T>(arr: (T | T[])[]): T[] {
	return arr.reduce<T[]>(
		(acc, item) =>
			acc.concat(Array.isArray(item) ? flatten(item as (T | T[])[]) : item),
		[],
	);
}

